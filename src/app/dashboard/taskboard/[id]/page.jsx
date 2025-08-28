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
import { useParams, useRouter } from "next/navigation";
import ProjectSelector from "@/components/ProjectSelector";
import { Card } from "@/components/ui/card";
import TaskCard from "./_components/TaskCard";
import { KanbanBoardSkeleton } from "@/components/Skeletons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBoards } from "@/app/api/taskboard/navbarSelector/getBoard";
import { getColumns } from "@/app/api/taskboard/board/columnAction/getColumns";
import { createColumns } from "@/app/api/taskboard/board/columnAction/createColumns";
import { renameColumn } from "@/app/api/taskboard/board/columnAction/renameColumn";
import { getCards } from "@/app/api/taskboard/board/cardAction/getCard";
import { createCard } from "@/app/api/taskboard/board/cardAction/createCard";
import { updateCardPosition } from "@/app/api/taskboard/board/cardAction/moveCard";
import { updateColumnPosition } from "@/app/api/taskboard/board/columnAction/moveColumns";

const KanbanBoard = () => {
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);

  const router = useRouter();
  const params = useParams();
  const boardId = params?.id;
  const queryClient = useQueryClient();

  const columnId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
        delay: 100,
        tolerance: 5,
      },
    })
  );

  // useQuery hooks
  const { data: boardData } = useQuery({
    queryKey: ["boardData"],
    queryFn: () => getBoards(),
  });

  const { data: columnsListData, isLoading } = useQuery({
    queryKey: ["columnsList", boardId],
    queryFn: () => getColumns(boardId),
    enabled: !!boardId,
  });

  const { data: columnsCardData } = useQuery({
    queryKey: ["cardList", columnId],
    queryFn: () => getCards(columnId),
    enabled: !!boardId,
  });

  useEffect(() => {
    if (columnsListData?.data) {
      // Add null check with optional chaining
      const transformed = columnsListData.data.map((col) => ({
        ...col,
        title: col.name,
      }));
      setColumns(transformed);
    } else {
      setColumns([]);
    }
  }, [columnsListData]);

  useEffect(() => {
    if (columnsCardData?.data) {
      const transformedCards = columnsCardData.data.map((card) => ({
        id: card.id,
        board_list: card.board_list,
        title: card.title,
        description: card.description,
        labels: card.labels,
        comments: card.comments || [],
        position: card.card_position,
        assignedUsers: card.assigned_users,
        createdAt: card.created_at,
        coverImage: card.cover_image,
      }));
      setTasks(transformedCards);
    } else {
      setTasks([]);
    }
  }, [columnsCardData]);

  const addColumnsMutation = useMutation({
    mutationFn: (data) => createColumns(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columnsList", boardId] });
    },
    onError: (e) => {
      toast.error("Column creation failed: " + e.message);
    },
  });

  const columnRename = useMutation({
    mutationFn: (data) => renameColumn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columnsList", boardId] });
    },
    onError: (e) => {
      toast.error("rename column failed: " + e.message);
    },
  });

  const addCard = useMutation({
    mutationFn: (data) => createCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardList", columnId] });
      queryClient.invalidateQueries({ queryKey: ["columnsList", boardId] });
      queryClient.invalidateQueries({ queryKey: ["boardData"] });
      toast.success("Card added successfully");
    },
    onError: (e) => {
      toast.error("adding card failed " + e.message);
    },
  });

  const moveCardMutation = useMutation({
    mutationFn: (data) => updateCardPosition(data),
    onMutate: () => {
      // Optional: Add loading state
      console.log("Moving card...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardList"] });
      queryClient.invalidateQueries({ queryKey: ["columnsList", boardId] });
      toast.success("Card moved successfully");
    },
    onError: (e) => {
      toast.error("Failed to move card: " + e.message);
      queryClient.invalidateQueries({ queryKey: ["cardList"] });
    },
  });

  const moveColumnMutation = useMutation({
    mutationFn: (data) => updateColumnPosition(data),
    onMutate: () => {
      console.log("Moving Column...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardList"] });
      queryClient.invalidateQueries({ queryKey: ["columnsList", boardId] });
    },
    onError: (e) => {
      toast.error("Failed to move card: " + e.message);
      queryClient.invalidateQueries({ queryKey: ["cardList"] });
    },
  });

  // Event handlers and other functions
  const handleProjectSelection = (projectId) => {
    router.push(`/dashboard/taskboard/${projectId}`);
  };

  const handleClick = () => {
    const columnToAdd = {
      boardId: boardId,
      name: `Column ${columns.length + 1}`,
    };
    addColumnsMutation.mutate(columnToAdd);
  };

  const deleteColumn = (id) => {
    const tasksToDelete = tasks.filter((task) => task.columnId === id);

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
    const { active, over } = event;

    setActiveColumn(null);
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Handle column movements
    if (active.data.current?.type === "Column") {
      // Update UI first for responsiveness
      setColumns((columns) => {
        const activeIndex = columns.findIndex((col) => col.id === activeId);
        const overIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeIndex, overIndex);
      });

      // Get the new positions after moving
      const activeColumn = columns.find((col) => col.id === activeId);
      const overColumn = columns.find((col) => col.id === overId);

      const movedColumns = {
        columnId: activeId,
        position: overColumn.board_list_position,
      };
      // Trigger column position update mutation
      moveColumnMutation.mutate(movedColumns);
    }
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

    // Handle task-to-task movement
    if (isOverATask) {
      const overTask = tasks.find((task) => task.id === overId);

      // Update UI
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        return arrayMove(tasks, activeIndex, overIndex);
      });

      // Trigger mutation
      const movedCard = {
        cardId: activeId,
        board_list_id: overTask.board_list,
        position: overTask.position,
      };
      moveCardMutation.mutate(movedCard);
    }

    // Handle task-to-column movement
    if (isOverAColumn) {
      const columnTasks = tasks.filter((task) => task.board_list === overId);
      const lastPosition =
        columnTasks.length > 0
          ? Math.max(...columnTasks.map((task) => task.position))
          : 0;

      // Update UI
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const updatedTasks = [...tasks];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          board_list: overId,
        };
        return updatedTasks;
      });

      // Trigger mutation
      const movedCard = {
        cardId: activeId,
        board_list_id: overId,
        position: lastPosition + 1,
      };
      moveCardMutation.mutate(movedCard);
    }
  };

  const updateColumn = (id, title, isComplete = false) => {
    console.log(`Updating column ${id} with new title: "${title}"`);

    // Update local state immediately for UI responsiveness
    const newColumns = columns.map((col) =>
      col.id !== id ? col : { ...col, title }
    );
    setColumns(newColumns);

    // Only trigger the mutation when editing is complete (dialog closes)
    if (isComplete) {
      columnRename.mutate({
        columnId: id,
        name: title,
      });
    }
  };

  const createTask = (columnId) => {
    const newTask = {
      board_list: columnId,
      title: `Task ${tasks.length + 1}`,
    };

    console.log(`Creating new task in column ${columnId}:`, newTask);

    addCard.mutate(newTask);
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
    setTasks(
      tasks.map((task) => {
        if (task.id === cardId) {
          const labels = task.labels || [];

          const updatedLabels = labels.includes(label) ? [] : [label];

          return {
            ...task,
            labels: updatedLabels,
          };
        }

        return task;
      })
    );
  };

  if (isLoading) {
    return <KanbanBoardSkeleton />;
  }

  return (
    <div className="flex flex-col w-full h-[90vh] overflow-hidden">
      <ProjectSelector
        title="Taskboard"
        options={
          boardData?.data?.map((project) => ({
            value: project.id,
            label: project.name,
          })) || []
        }
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
                    <ColumnsContainer
                      key={col.id}
                      column={col}
                      deleteColumn={deleteColumn}
                      updateColumn={updateColumn}
                      createTask={createTask}
                      tasks={tasks.filter((task) => task.board_list === col.id)} // Match board_list with column id
                      deleteTask={deleteTask}
                      updateTask={updateTask}
                      onAddComment={handleAddComment}
                      onAddAttachment={handleAddAttachment}
                      onAddLabel={handleAddLabel}
                    />
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
                      (task) => task.board_list === activeColumn.id
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
