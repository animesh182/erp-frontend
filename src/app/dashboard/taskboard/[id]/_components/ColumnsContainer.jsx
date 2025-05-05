"use client";
import React, { useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FolderPen, MoreVerticalIcon, PlusIcon, TrashIcon } from "lucide-react";
import TaskCard from "./TaskCard";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { setNodeRef, attributes, listeners, transform, isDragging } =
    useSortable({
      id: column.id,
      data: { type: "Column", column },
      disabled: editMode,
    });

  console.log("from containers:", tasks);

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
        //this was to enabkle the edit tiltle on tap but, draggable component is oveerridding it thus not working for now
        // onMouseDown={(e) => {
        //   if (!isDragging && !editMode) setEditMode(true);
        // }}
        className="h-[60px] flex items-center justify-between px-3 font-semibold cursor-grab border-b border-border bg-muted"
      >
        <div className="flex items-center gap-2">
          <div className="flex justify-center items-center px-2 py-1 text-sm rounded-full bg-accent text-foreground">
            {tasks?.length || 0}
          </div>
          {!editMode && <span className="text-foreground">{column.title}</span>}
          {editMode && (
            <input
              className="bg-background text-foreground border border-border focus:ring-2 focus:ring-primary rounded px-1"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value, false)}
              onBlur={(e) => updateColumn(column.id, e.target.value, true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateColumn(column.id, e.target.value, true);
                  setEditMode(false);
                }
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => createTask(column.id)}
            className="p-2 rounded hover:bg-primary/10"
          >
            <PlusIcon className="text-primary" />
          </button>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Column options"
                className="p-2 rounded hover:bg-accent/10"
              >
                <MoreVerticalIcon className="text-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Columns action</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditMode(true);
                  setMenuOpen(false);
                }}
              >
                <div className="flex flex-row  w-full items-center gap-1 justify-between">
                  Rename column
                  <FolderPen className="w-4 h-4" />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-white focus:bg-destructive/90"
                onClick={() => {
                  setMenuOpen(false);
                  setDeleteDialogOpen(true);
                }}
              >
                <div className="flex flex-row w-full items-center gap-1 justify-between">
                  Delete column <TrashIcon className="w-4 h-4" />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col flex-grow gap-2 p-2 bg-muted overflow-y-auto !h-[50vh]">
        {tasks && tasks.length > 0 ? (
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
        ) : (
          <div className="text-muted-foreground text-center py-4">
            No tasks in this column
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete column</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this column? This action cannot be
            undone and will remove all tasks in this column.
          </AlertDialogDescription>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteColumn(column.id);
              setDeleteDialogOpen(false);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ColumnsContainer;
