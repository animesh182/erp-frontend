"use client";
import React, { useState, useCallback, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Paperclip, Tag, MessageCircle, User } from "lucide-react";
import { marked } from "marked";
import { Card } from "@/components/ui/card";

const LABELS = [
  { name: "Urgent", color: "bg-red-500", hoverColor: "bg-red-400" },
  { name: "High", color: "bg-amber-600", hoverColor: "bg-amber-400" },
  { name: "Medium", color: "bg-amber-500", hoverColor: "bg-amber-400" },
  { name: "Low", color: "bg-emerald-400", hoverColor: "bg-emerald-300" },
];

const TaskCard = ({
  card,
  onUpdateCard,
  onDeleteCard,
  onAddComment,
  onAddAttachment,
  onAddLabel,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const [isEditingFullDescription, setIsEditingFullDescription] =
    useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef(null);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleInputRef.current) {
      onUpdateCard(card.id, { ...card, title: titleInputRef.current.value });
    }
  };

  const handleTitleKeyDown = (event) => {
    if (event.key === "Enter") {
      setIsEditingTitle(false);
      if (titleInputRef.current) {
        onUpdateCard(card.id, { ...card, title: titleInputRef.current.value });
      }
    }
  };

  const { setNodeRef, attributes, listeners, transform, isDragging } =
    useSortable({
      id: card.id,
      data: { type: "Task", task: card },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : "transform 200ms ease",
    opacity: isDragging ? 0.4 : 1,
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSave = useCallback(() => {
    onUpdateCard(card.id, { title, description });
    setIsDialogOpen(false);
    setIsEditingFullDescription(false);
  }, [card.id, description, onUpdateCard, title]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(card.id, newComment);
      setNewComment("");
    }
  };

  const handleAddAttachment = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onAddAttachment(card.id, file);
    }
  };

  const handleAddLabel = (label) => {
    onAddLabel(card.id, label);
  };

  const handleDescriptionClick = () => {
    setIsEditingFullDescription(true);
  };

  const handleSaveFullDescription = () => {
    onUpdateCard(card.id, { title, description });
    setIsEditingFullDescription(false);
  };

  const truncateDescription = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= 20) return text;
    return words.slice(0, 20).join(" ") + "...";
  };

  const getCardLabel = () => {
    if (!card?.labels || card.labels.length === 0) return null;
    const labelName = card.labels[0];
    const labelObj = LABELS.find((l) => l.name === labelName);
    return labelObj;
  };

  const cardLabel = getCardLabel();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card rounded-md shadow-md transition-colors"
    >
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div
            {...attributes}
            {...listeners}
            className="p-4 cursor-grab hover:bg-card/80 relative"
          >
            {cardLabel && (
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full text-white ${cardLabel.color}`}
                >
                  {cardLabel.name}
                </span>
              </div>
            )}

            <h3 className="text-base font-medium mb-2 pr-16">{card.title}</h3>

            {/* Description (truncated) */}
            {card.description && (
              <div
                className="prose prose-sm max-w-none text-foreground break-words"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(truncateDescription(card.description)),
                }}
              />
            )}

            {/* Separator */}
            <hr className="border-t border-border my-2" />

            {/* Bottom section */}
            <div className="flex items-center justify-between mt-2">
              {/* Avatar */}
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={14} className="text-primary" />
                </div>
              </div>

              {/* Metadata section */}
              <div className="flex items-center gap-3">
                {/* Comments count */}
                {card?.comments?.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle size={14} />
                    <span>{card.comments.length}</span>
                  </div>
                )}

                {/* Files count */}
                {card?.files?.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Paperclip size={14} />
                    <span>{card.files.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent
          className={`bg-background text-foreground px-4 py-8 ${
            isEditingFullDescription ? "sm:max-w-[1200px]" : "sm:max-w-[600px]"
          }`}
        >
          {isEditingFullDescription ? (
            <div className="flex flex-col h-[700px] max-h-[80vh]">
              {/* Title Input - Takes 10% of space */}
              <div className="mb-4">
                <DialogHeader className="mb-2">
                  <DialogTitle></DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                {isEditingTitle ? (
                  <div className="w-full">
                    <Input
                      ref={titleInputRef}
                      defaultValue={card?.title}
                      onBlur={handleTitleBlur}
                      onKeyDown={handleTitleKeyDown}
                      placeholder="Card Title"
                      className="bg-input border-input text-foreground w-1/2"
                      autoFocus
                    />
                  </div>
                ) : (
                  <span
                    onClick={handleTitleClick}
                    className="cursor-pointer font-bold text-lg"
                  >
                    {card?.title || "Task Title"}
                  </span>
                )}
                <div className="flex flex-row justify-between items-center p-2">
                  <div>
                    <h4 className="font-medium leading-none flex items-center gap-1">
                      <Tag className="w-4 h-4" /> Labels
                    </h4>

                    <div className="flex gap-2 mt-2">
                      {LABELS.map((label) => (
                        <Button
                          key={label.name}
                          variant="outline"
                          size="sm"
                          className={`text-foreground hover:bg-muted ${
                            card?.labels?.includes(label.name)
                              ? `${label.color} text-white hover:${label.hoverColor} hover:text-white`
                              : "bg-card"
                          }`}
                          onClick={() => handleAddLabel(label.name)}
                        >
                          {label.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <hr className="border-t border-border my-2" />
              </div>

              {/* Main Content - Takes 90% of space */}
              <div className="flex flex-row gap-6 flex-1 overflow-hidden">
                {/* Left Column - Scrollable */}

                <Card className="flex-1 overflow-y-auto p-2">
                  <div className="bg-input border-input text-foreground p-2 rounded-md prose prose-sm max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(description),
                      }}
                    />
                  </div>

                  {/* Task metadata */}
                  <div className="space-y-4 py-4">
                    <Card className="p-2 bg-card">
                      <h4 className="font-medium leading-none flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" /> Comments
                        <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center p-1">
                          {card?.comments?.length > 0 && (
                            <span className="text-xs">
                              {card.comments.length}
                            </span>
                          )}
                        </div>
                      </h4>
                      <div className="space-y-4 mt-2">
                        {card?.comments?.map((comment, index) => (
                          <div
                            key={index}
                            className="p-2 rounded bg-muted text-muted-foreground"
                          >
                            {comment}
                          </div>
                        ))}
                        <div className="flex gap-2 p-1">
                          <Input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="bg-input border-input text-foreground"
                          />
                          <Button onClick={handleAddComment} size="sm">
                            Post
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <div>
                      <h4 className="font-medium leading-none flex items-center gap-1">
                        <Paperclip className="w-4 h-4" /> Attachments
                      </h4>
                      <div className="mt-2">
                        <input
                          type="file"
                          onChange={handleAddAttachment}
                          className="text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Right Column - Full Description Editor (50% height) */}
                <div className="flex-1 flex flex-col px-1 pb-1">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <h3 className="font-medium">Edit Full Description</h3>
                    <Button onClick={handleSaveFullDescription} size="sm">
                      Save Description
                    </Button>
                  </div>
                  <Textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Edit full description..."
                    className="bg-input border-input text-foreground flex-1 overflow-y-auto resize-none "
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  variant="destructive"
                  onClick={() => onDeleteCard(card.id)}
                  className="mr-2"
                >
                  Delete
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </DialogFooter>
            </div>
          ) : (
            /* Regular view when not editing description */
            <div className="flex flex-col max-h-[80vh]">
              <div className="mb-4">
                {isEditingTitle ? (
                  <Input
                    ref={titleInputRef}
                    defaultValue={card?.title}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    placeholder="Card Title"
                    className="bg-input border-input text-foreground"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={handleTitleClick}
                    className="cursor-pointer font-bold text-lg"
                  >
                    {card?.title || "Task Title"}
                  </span>
                )}
                <div className="flex flex-row justify-between items-center p-2">
                  <div>
                    <h4 className="font-medium leading-none flex items-center gap-1">
                      <Tag className="w-4 h-4" /> Labels
                    </h4>

                    <div className="flex gap-2 mt-2">
                      {LABELS.map((label) => (
                        <Button
                          key={label.name}
                          variant="outline"
                          size="sm"
                          className={`text-foreground hover:bg-muted ${
                            card?.labels?.includes(label.name)
                              ? `${label.color} text-white hover:${label.hoverColor} hover:text-white`
                              : "bg-card"
                          }`}
                          onClick={() => handleAddLabel(label.name)}
                        >
                          {label.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Card className="overflow-y-auto flex-1 p-2">
                <div
                  onClick={handleDescriptionClick}
                  className="bg-input border-input text-foreground p-2 rounded-md cursor-pointer max-w-none mb-4"
                >
                  <div
                    className="prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(description),
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium leading-none flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" /> Comments
                      <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center p-1">
                        {card?.comments?.length > 0 && (
                          <span className="text-xs">
                            {card.comments.length}
                          </span>
                        )}
                      </div>
                    </h4>
                    <div className="space-y-4 mt-2 px-2">
                      {card?.comments?.map((comment, index) => (
                        <div
                          key={index}
                          className="p-2 rounded bg-muted text-muted-foreground"
                        >
                          {comment}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="bg-input border-input text-foreground"
                        />
                        <Button onClick={handleAddComment} size="sm">
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium leading-none flex items-center gap-1">
                      <Paperclip className="w-4 h-4" /> Attachments
                    </h4>
                    <div className="mt-2">
                      <input
                        type="file"
                        onChange={handleAddAttachment}
                        className="text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <DialogFooter className="mt-4">
                <Button
                  variant="destructive"
                  onClick={() => onDeleteCard(card.id)}
                  className="mr-2"
                >
                  Delete
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskCard;
