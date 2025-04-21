"use client";
import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import ColumnsContainer from "./_components/ColumnsContainer";
import TaskCard from "./_components/TaskCard";
import { PlusIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import ProjectSelector from '@/components/ProjectSelector';

const KanbanBoard = () => {
  // header
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const router = useRouter();

  const projectData = useMemo(() => [
    { value: 'alpha', label: 'Project Alpha' },
    { value: 'beta', label: 'Project Beta' },
    { value: 'gamma', label: 'Project Gamma' },
    { value: 'delta', label: 'Project Delta' },
  ], []);

  const handleProjectSelection = (projectId) => {
    setSelectedProjectId(projectId);
    router.push(`/dashboard/taskboard/${projectId}`);
  };

  // columns logic
  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem("columns");
    return savedColumns ? JSON.parse(savedColumns) : [];
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const columnId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleClick = () => {
    const columnToAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  };

  const deleteColumn = (id) => {
    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  };

  const generateId = () => Math.floor(Math.random() * 10001);

  const onDragStart = (event) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeIndex = columns.findIndex((col) => col.id === activeColumnId);
      const overIndex = columns.findIndex((col) => col.id === overColumnId);
      return arrayMove(columns, activeIndex, overIndex);
    });
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    if (!isActiveATask) return;

    if (isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    if (isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].columnId = overId;
        return [...tasks];
      });
    }
  };

  const updateColumn = (id, title) => {
    const newColumns = columns.map((col) =>
      col.id !== id ? col : { ...col, title }
    );
    setColumns(newColumns);
  };

  const createTask = (columnId) => {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id, content) => {
    const updated = tasks.map((task) =>
      task.id !== id ? task : { ...task, content }
    );
    setTasks(updated);
  };

  return (
    <div className="flex flex-col w-full h-[90vh] overflow-hidden">
       <ProjectSelector
          title="Taskboard"
          options={projectData}
          onValueChange={handleProjectSelection}
          placeholder="Select a Project to View"
        />
      <Card className="flex-grow bg-background m-2 p-2">
        <div className="flex w-full items-start overflow-auto px-4 py-4 bg-background h-full">
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <div className="flex gap-4 h-full">
              <div className="flex gap-4 h-full">
                <SortableContext items={columnId}>
                  {columns.map((col) => (
                    <div key={col.id} className="h-full">
                      <ColumnsContainer
                        column={col}
                        deleteColumn={deleteColumn}
                        updateColumn={updateColumn}
                        createTask={createTask}
                        tasks={tasks.filter((task) => task.columnId === col.id)}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                      />
                    </div>
                  ))}
                </SortableContext>
              </div>
              <button
                onClick={handleClick}
                className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-column-background border-2 border-border p-4 ring-primary hover:ring-2 flex gap-2 text-foreground"
              >
                <PlusIcon />
                Add Column
              </button>
            </div>

            {createPortal(
              <DragOverlay>
                {activeColumn && (
                  <ColumnsContainer
                    column={activeColumn}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    tasks={tasks.filter(
                      (task) => task.columnId === activeColumn.id
                    )}
                    updateTask={updateTask}
                  />
                )}
                {activeTask && (
                  <TaskCard
                    task={activeTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      </Card>
    </div>
  );
};

export default KanbanBoard;