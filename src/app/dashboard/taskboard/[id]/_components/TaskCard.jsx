"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
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
import {
  Paperclip,
  Tag,
  MessageCircle,
  User,
  ChevronDown,
  ChevronUp,
  Reply,
  ListCollapse,
} from "lucide-react";
import { marked } from "marked";
import { Card } from "@/components/ui/card";
import Cookie from "js-cookie";
import { format } from "date-fns";
import { AttachmentsSection } from "./AttachmentsSection";
import CollapsibleDetail from "./DetailsSection";

const LABELS = [
  { name: "Urgent", color: "bg-red-500", hoverColor: "bg-red-400" },
  { name: "High", color: "bg-amber-600", hoverColor: "bg-amber-400" },
  { name: "Medium", color: "bg-amber-500", hoverColor: "bg-amber-400" },
  { name: "Low", color: "bg-emerald-400", hoverColor: "bg-emerald-300" },
];

const ReplyItem = ({ reply, currentUser }) => {
  const isCurrentUser = reply.author === currentUser;

  return (
    <div
      className={`p-2 rounded bg-muted/50  text-sm mb-1 w-[80%] ${
        isCurrentUser ? "mr-auto" : "ml-auto"
      }`}
    >
      <div className="flex justify-start gap-4 text-xs  mb-1">
        <span>{reply.author || "Unknown User"}</span>
        <span className="text-muted-foreground">
          {formatCommentDate(reply.timestamp)}
        </span>
      </div>
      {reply.text}
    </div>
  );
};

const CommentItem = ({ comment, currentUser, onAddReply }) => {
  const [isRepliesVisible, setIsRepliesVisible] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleAddReply = () => {
    if (replyText.trim()) {
      onAddReply({
        text: replyText,
        author: currentUser,
        timestamp: new Date().toISOString(),
      });
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  return (
    <div className="p-2 rounded bg-muted  text-sm">
      <div className="flex justify-between text-xs mb-1">
        <span>{comment.author || "Unknown User"}</span>
        <span>{formatCommentDate(comment.timestamp)}</span>
      </div>
      {comment.text}

      <div className="flex justify-between mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-6 p-1"
          onClick={() => setShowReplyInput(!showReplyInput)}
        >
          <Reply size={12} className="mr-1" /> Reply
        </Button>

        {hasReplies && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 p-1"
            onClick={() => setIsRepliesVisible(!isRepliesVisible)}
          >
            {isRepliesVisible ? (
              <ChevronUp size={12} className="mr-1" />
            ) : (
              <ChevronDown size={12} className="mr-1" />
            )}
            {comment.replies.length}{" "}
            {comment.replies.length === 1 ? "reply" : "replies"}
          </Button>
        )}
      </div>

      {showReplyInput && (
        <div className="mt-2 flex gap-2">
          <Input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="bg-input border-input text-foreground text-xs h-8"
          />
          <Button onClick={handleAddReply} size="sm" className="h-8">
            Post
          </Button>
        </div>
      )}

      {hasReplies && isRepliesVisible && (
        <div className="mt-2 pl-4 border-l-2 border-muted-foreground/20">
          {comment.replies.map((reply, index) => (
            <ReplyItem key={index} reply={reply} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  );
};

const formatCommentDate = (timestamp) => {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    return format(date, "HH:mm MMM dd, yyyy");
  } catch (error) {
    console.error("Failed to format date:", error);
    return "Invalid Date";
  }
};

const CommentsSection = ({
  card,
  newComment,
  setNewComment,
  handleAddComment,
  handleAddReply,
  userName,
}) => (
  <Card className="space-y-4 py-4 mt-4">
    <h4 className="font-medium leading-none flex items-center gap-1 px-2 pt-2">
      Comments
      <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center p-1">
        {card?.comments?.length > 0 ? (
          <span className="text-xs">{card.comments.length}</span>
        ) : (
          <span className="text-xs">0</span>
        )}
      </div>
    </h4>
    <div className="h-px bg-gray-300 w-full my-4"></div>

    <div className="space-y-4 my-2 p-2">
      <div className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="bg-input border-input text-foreground"
        />
        <Button onClick={handleAddComment}>Post</Button>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {/* Render comments with author and timestamp */}
        {card?.comments?.map((comment, index) => (
          <CommentItem
            key={index}
            comment={comment}
            currentUser={userName}
            onAddReply={(reply) => handleAddReply(index, reply)}
          />
        ))}
      </div>
    </div>
  </Card>
);

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
  const [userName, setUserName] = useState("Unknown User");
  const titleInputRef = useRef(null);

  useEffect(() => {
    const clockifyUserDataCookie = Cookie.get("clockifyUserData");
    if (clockifyUserDataCookie) {
      try {
        const userData = JSON.parse(clockifyUserDataCookie);
        if (userData?.full_name) {
          setUserName(userData.full_name);
        }
      } catch (error) {
        console.error("Failed to parse clockifyUserData cookie:", error);
      }
    }
  }, []);

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
      const commentObject = {
        text: newComment,
        author: userName,
        timestamp: new Date().toISOString(),
        replies: [],
      };
      onAddComment(card.id, commentObject);
      setNewComment("");
    }
  };

  const handleAddReply = (commentIndex, reply) => {
    const updatedComments = [...card.comments];
    if (!updatedComments[commentIndex].replies) {
      updatedComments[commentIndex].replies = [];
    }
    updatedComments[commentIndex].replies.push(reply);
    onUpdateCard(card.id, { ...card, comments: updatedComments });
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

  //fake data remove afrer api is ready
  const detailsData = [
    {
      id: "1",
      name: "Kaustub karki",
      description: "kaustub created this card",
      created_at: "2025-04-26T10:00:00Z",
      Card_id: "card-1",
    },
    {
      id: "2",
      name: "Sajjan Poudel",
      description: "Another detail with a longer description that wraps.",
      created_at: "2025-04-27T11:30:00Z",
      Card_id: "card-1",
    },
    {
      id: "3",
      name: "Ishu Shrestha",
      description: "",
      created_at: "2025-04-28T09:15:00Z",
      Card_id: "card-1",
    },
  ];

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
                className="marked-files-content prose prose-sm [&>*]:max-w-none text-foreground break-words"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(truncateDescription(card.description)),
                  style: {
                    color: "var(--foreground)",
                  },
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
                {card?.files?.length > 0 ? (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Paperclip size={14} />
                    <span>{card.files.length}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Paperclip size={14} />
                    <span>0</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent
          className={`bg-background text-foreground px-4 space-y-4 ${
            isEditingFullDescription ? "sm:max-w-[1400px]" : "sm:max-w-[700px]"
          }`}
        >
          <div className="flex flex-col max-h-[80vh] overflow-x-hidden">
            {/* Card Header Section - Common to both views */}
            <div className="mb-4">
              {/* Title Input */}
              <div className={isEditingFullDescription ? "mb-2" : ""}>
                {isEditingFullDescription && (
                  <DialogHeader className="mb-2">
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                )}
                {isEditingTitle ? (
                  <div
                    className={`w-full ${
                      isEditingFullDescription ? "" : "p-2"
                    }`}
                  >
                    <Input
                      ref={titleInputRef}
                      defaultValue={card?.title}
                      onBlur={handleTitleBlur}
                      onKeyDown={handleTitleKeyDown}
                      placeholder="Card Title"
                      className={`bg-input border-input text-foreground ${
                        isEditingFullDescription ? "w-1/2" : ""
                      }`}
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
              </div>

              {/* Labels Section */}
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
              {isEditingFullDescription && (
                <hr className="border-t border-border my-2" />
              )}
            </div>

            {/* Main Content Area */}
            {isEditingFullDescription ? (
              /* Full Description Editing View */
              <div className="flex flex-row gap-6 flex-1 overflow-hidden">
                {/* Left Column - Scrollable */}
                <Card className="flex-1 overflow-y-auto p-2">
                  <div className="bg-input border-input text-foreground p-2 rounded-md prose prose-sm max-w-none w-full min-h-8">
                    <div
                      className="marked-files-content prose prose-sm max-w-none w-full text-foreground break-words"
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(description),
                      }}
                    />
                  </div>

                  {/* Task metadata - will be replaced with shared components */}
                  <div className="space-y-4">
                    <CommentsSection
                      card={card}
                      newComment={newComment}
                      setNewComment={setNewComment}
                      handleAddComment={handleAddComment}
                      handleAddReply={handleAddReply}
                      userName={userName}
                    />

                    <AttachmentsSection
                      handleAddAttachment={handleAddAttachment}
                    />
                    <Card className="p-2 ">
                      <div className="flex flex-col w-full">
                        <div className="flex flex-row gap-2 items-center justify-start">
                          <ListCollapse />
                          <h2 className="text-md font-bold p-2">
                            Details Section
                          </h2>
                        </div>
                        <CollapsibleDetail data={detailsData} />
                      </div>
                    </Card>
                  </div>
                </Card>

                {/* Right Column - Full Description Editor */}
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
                    className="bg-input border-input text-foreground flex-1 overflow-y-auto resize-none"
                  />
                </div>
              </div>
            ) : (
              /* Regular View */
              <Card className="overflow-y-auto overflow-x-hidden flex-1 p-2 max-w-[100%]">
                <div
                  onClick={handleDescriptionClick}
                  className="bg-input border-input text-foreground p-2 rounded-md cursor-pointer prose prose-sm max-w-none w-full min-h-8"
                >
                  <div className="flex items-center gap-2">
                    <h2 className="text-foreground m-0">Description</h2>
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>

                  <div
                    className="marked-files-content prose prose-sm max-w-none w-full text-foreground break-words"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(description),
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <CommentsSection
                    card={card}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleAddComment={handleAddComment}
                    handleAddReply={handleAddReply}
                    userName={userName}
                  />

                  <AttachmentsSection
                    handleAddAttachment={handleAddAttachment}
                  />
                  <Card className="p-2 ">
                    <div className="flex flex-col w-full">
                      <div className="flex flex-row gap-2 items-center justify-start">
                        <ListCollapse />
                        <h2 className="text-md font-bold p-2">
                          Details Section
                        </h2>
                      </div>
                      <CollapsibleDetail data={detailsData} />
                    </div>
                  </Card>
                </div>
              </Card>
            )}

            {/* Footer - Common to both views */}
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskCard;
