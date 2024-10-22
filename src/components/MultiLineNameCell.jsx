import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

const MultiLineNameCell = ({
  imageUrl,
  title,
  subtitle,
  designation,
  isActive,
}) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-start">
      <Avatar>
        <AvatarImage src={imageUrl} className="object-cover" />
        <AvatarFallback className={`${!isActive ? "bg-red-500" : ""}`}>
          {imageUrl ? <span>{title}</span> : getInitials(title)}
        </AvatarFallback>
      </Avatar>
      <div className="ml-3">
        <div className="text-sm font-medium">
          {!isActive ? <span className="text-red-500">{title}</span> : title}
        </div>
        <div className="text-xs text-muted-foreground">
          {designation ?? subtitle}
        </div>
      </div>
    </div>
  );
};

export default MultiLineNameCell;
