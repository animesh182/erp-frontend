"use client";
import React, { useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon, TrashIcon } from "lucide-react";
import TaskCard from "./TaskCard";

const ColumnsContainer = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
  onAddComment,
  onAddAttachment,
  onAddLabel,
}) => {
  const [editMode, setEditMode] = useState(false);

  const { setNodeRef, attributes, listeners, transform, isDragging } =
    useSortable({
      id: column.id,
      data: { type: "Column", column },
      disabled: editMode,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : "transform 200ms ease",
    opacity: isDragging ? 0.4 : 1,
  };

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
        onMouseDown={(e) => {
          // Only enable edit mode if not dragging
          if (!isDragging && !editMode) {
            setEditMode(true);
          }
        }}
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
        <div>
          <button
            onClick={() => deleteColumn(column.id)}
            className="p-2 rounded hover:bg-destructive/10"
          >
            <TrashIcon className="text-foreground" />
          </button>
          <button
            onClick={() => createTask(column.id)}
            className="p-2 rounded hover:bg-destructive/10"
          >
            <PlusIcon className="text-primary" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col flex-grow gap-2 p-2 bg-muted overflow-y-auto !h-[50vh]">
        <SortableContext items={tasks.map((t) => t.id)}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              card={task}
              onUpdateCard={updateTask}
              onDeleteCard={deleteTask}
              onAddComment={onAddComment}
              onAddAttachment={onAddAttachment}
              onAddLabel={onAddLabel}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default ColumnsContainer;
