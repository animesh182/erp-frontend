"use client";

import React, { useEffect, useMemo, useState } from "react";

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
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ProjectSelector from "@/components/ProjectSelector";
import { Card } from "@/components/ui/card";
import TaskCard from "./_components/TaskCard";

const KanbanBoard = () => {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const router = useRouter();
  const projectData = useMemo(
    () => [
      { value: "alpha", label: "Project Alpha" },
      { value: "beta", label: "Project Beta" },
      { value: "gamma", label: "Project Gamma" },
      { value: "delta", label: "Project Delta" },
    ],
    []
  );

  const handleProjectSelection = (projectId) => {
    console.log("Project selected:", projectId);
    setSelectedProjectId(projectId);
    router.push(`/dashboard/taskboard/${projectId}`);
  };


  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem("columns")
    const loadedColumns = savedColumns ? JSON.parse(savedColumns) : [];
    console.log("Initial columns loaded:", loadedColumns);
    return loadedColumns;
  });


  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    const loadedTasks = savedTasks ? JSON.parse(savedTasks) : [];
    console.log("Initial tasks loaded:", loadedTasks);
    return loadedTasks;
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
    console.log("Saving columns to localStorage:", columns);
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    console.log("Saving tasks to localStorage:", tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const generateId = () => Math.floor(Math.random() * 10001);

  const handleClick = () => {
    const columnToAdd = {
      id: generateId(),

      title: `Column ${columns.length + 1}`,
    };

    console.log("Adding new column:", columnToAdd);
    setColumns([...columns, columnToAdd]);
  };

  const deleteColumn = (id) => {
    console.log("Deleting column with ID:", id);

    // Get tasks that will be deleted with this column

    const tasksToDelete = tasks.filter((task) => task.columnId === id);
    console.log("Tasks being deleted with column:", tasksToDelete);

    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  };

  const onDragStart = (event) => {
    console.log("Drag started:", event);

    if (event.active.data.current?.type === "Column") {
      console.log("Column drag started:", event.active.data.current.column);

      setActiveColumn(event.active.data.current.column);

      return;
    }

    if (event.active.data.current?.type === "Task") {
      console.log("Task drag started:", event.active.data.current.task);

      setActiveTask(event.active.data.current.task);

      return;
    }
  };

  const onDragEnd = (event) => {
    console.log("Drag ended:", event);

    setActiveColumn(null);

    setActiveTask(null);

    const { active, over } = event;

    if (!over) {
      console.log("Drag ended outside of any droppable area");

      return;
    }

    const activeColumnId = active.id;

    const overColumnId = over.id;

    if (activeColumnId === overColumnId) {
      console.log("Dragged onto the same column - no changes needed");

      return;
    }

    console.log(
      `Reordering columns: ${activeColumnId} moved to position of ${overColumnId}`
    );

    setColumns((columns) => {
      const activeIndex = columns.findIndex((col) => col.id === activeColumnId);

      const overIndex = columns.findIndex((col) => col.id === overColumnId);

      // move columns logic

      console.log(
        `Moving column from index ${activeIndex} to index ${overIndex}`
      );

      return arrayMove(columns, activeIndex, overIndex);
    });
  };

  const onDragOver = (event) => {
    console.log("Drag over event:", event);

    const { active, over } = event;

    if (!over) {
      console.log("Dragging over nothing");

      return;
    }

    const activeId = active.id;

    const overId = over.id;

    if (activeId === overId) {
      console.log("Dragging over the same element");

      return;
    }

    const isActiveATask = active.data.current?.type === "Task";

    const isOverATask = over.data.current?.type === "Task";

    const isOverAColumn = over.data.current?.type === "Column";

    if (!isActiveATask) {
      console.log("Active element is not a task");

      return;
    }

    if (isOverATask) {
      console.log(`Task ${activeId} is being dragged over task ${overId}`);

      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        const overIndex = tasks.findIndex((t) => t.id === overId);

        // understand the column ID of the task being dragged over

        const targetColumnId = tasks[overIndex].columnId;

        console.log(
          `Moving task from index ${activeIndex} to index ${overIndex} in column ${targetColumnId}`
        );

        // Update the column ID

        tasks[activeIndex].columnId = targetColumnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    if (isOverAColumn) {
      console.log(`Task ${activeId} is being dragged over column ${overId}`);

      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        console.log(
          `Moving task from index ${activeIndex} to column ${overId}`
        );

        // Update the task with the new column ID

        tasks[activeIndex].columnId = overId;

        return [...tasks];
      });
    }
  };

  const updateColumn = (id, title) => {
    console.log(`Updating column ${id} with new title: "${title}"`);

    const newColumns = columns.map((col) =>
      col.id !== id ? col : { ...col, title }
    );

    setColumns(newColumns);
  };

  const createTask = (columnId) => {
    const newTask = {
      id: generateId(),

      columnId,

      title: `Task ${tasks.length + 1}`,

      description: "",

      comments: [],
    };

    console.log(`Creating new task in column ${columnId}:`, newTask);

    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    console.log(`Deleting task with ID: ${id}`);

    const taskToDelete = tasks.find((task) => task.id === id);

    console.log("Task being deleted:", taskToDelete);

    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id, updates) => {
    console.log(`Updating task with ID ${id}:`, updates);

    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const updatedTask = { ...task, ...updates };

          console.log("Task before update:", task);

          console.log("Task after update:", updatedTask);

          return updatedTask;
        }

        return task;
      })
    );
  };

  const handleAddComment = (cardId, comment) => {
    console.log(`Adding comment to task ${cardId}:`, comment);

    setTasks(
      tasks.map((task) => {
        if (task.id === cardId) {
          const updatedComments = [...task.comments, comment];

          console.log(`Task ${cardId} comments updated:`, updatedComments);

          return { ...task, comments: updatedComments };
        }

        return task;
      })
    );
  };

  const handleAddAttachment = (cardId, attachment) => {
    console.log(`Adding attachment to task ${cardId}:`, attachment);

    setTasks(
      tasks.map((task) => {
        if (task.id === cardId) {
          const updatedAttachments = [...(task.attachments || []), attachment];

          console.log(
            `Task ${cardId} attachments updated:`,

            updatedAttachments
          );

          return {
            ...task,

            attachments: updatedAttachments,
          };
        }

        return task;
      })
    );
  };

  const handleAddLabel = (cardId, label) => {
    console.log(`Modifying label for task ${cardId}:`, label);

    setTasks(
      tasks.map((task) => {
        if (task.id === cardId) {
          const labels = task.labels || [];

          // Toggle label (if exists, remove it; if doesn't exist, add it)

          const updatedLabels = labels.includes(label) ? [] : [label];

          console.log(`Task ${cardId} labels updated:`, updatedLabels);

          return {
            ...task,

            labels: updatedLabels,
          };
        }

        return task;
      })
    );
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
                  {columns.map((col) => {
                    const columnTasks = tasks.filter(
                      (task) => task.columnId === col.id
                    );

                    return (
                      <div key={col.id} className="h-full">
                        <ColumnsContainer
                          column={col}
                          deleteColumn={deleteColumn}
                          updateColumn={updateColumn}
                          createTask={createTask}
                          tasks={columnTasks}
                          deleteTask={deleteTask}
                          updateTask={updateTask}
                          onAddComment={handleAddComment}
                          onAddAttachment={handleAddAttachment}
                          onAddLabel={handleAddLabel}
                        />
                      </div>
                    );
                  })}
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
                    onAddComment={handleAddComment}
                    onAddAttachment={handleAddAttachment}
                    onAddLabel={handleAddLabel}
                  />
                )}

                {activeTask && (
                  <TaskCard
                    card={activeTask}
                    onDeleteCard={deleteTask}
                    onUpdateCard={updateTask}
                    onAddComment={handleAddComment}
                    onAddAttachment={handleAddAttachment}
                    onAddLabel={handleAddLabel}
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
