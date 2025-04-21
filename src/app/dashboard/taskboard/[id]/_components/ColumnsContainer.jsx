"use client";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { PlusIcon, TrashIcon } from "lucide-react";

const ColumnsContainer = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}) => {
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 border-2 border-primary w-[350px] h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
   
      <div
        ref={setNodeRef}
        style={style}
        className="bg-column-background w-[350px] h-full flex flex-col rounded-md border border-border"
      >
        {/* Header */}
        <div
          {...attributes}
          {...listeners}
          onClick={() => setEditMode(true)}
          className="h-[60px] flex items-center justify-between px-3 font-semibold cursor-grab border-b border-border bg-muted"
        >
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center px-2 py-1 text-sm rounded-full bg-accent text-foreground">
              {tasks.length}
            </div>
            {!editMode && <span className="text-foreground">{column.title}</span>}
            {editMode && (
              <input
                className="bg-background text-foreground border border-border focus:ring-2 focus:ring-primary rounded px-1"
                value={column.title}
                onChange={(e) => updateColumn(column.id, e.target.value)}
                autoFocus
                onBlur={() => setEditMode(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditMode(false);
                }}
              />
            )}
          </div>
          <button
            onClick={() => deleteColumn(column.id)}
            className="p-2 rounded hover:bg-destructive/10"
          >
            <TrashIcon className="text-foreground" />
          </button>
        </div>

        {/* Task List */}
        <div className="flex flex-col flex-grow gap-2 p-2 bg-muted overflow-y-auto !h-[50vh]">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            ))}
          </SortableContext>
        </div>

        {/* Footer */}
        <button
          className="mt-auto flex items-center gap-2 p-4 border-t border-border rounded-b-md hover:bg-accent hover:text-accent-foreground"
          onClick={() => createTask(column.id)}
        >
          <PlusIcon className="text-primary" />
          <span className="text-foreground">Add Task</span>
        </button>
      </div>

  );
};

export default ColumnsContainer;