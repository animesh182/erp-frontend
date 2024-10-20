import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

const MultiLineNameCell = ({ imageUrl, title, subtitle, designation }) => {
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
        <AvatarFallback>
          {imageUrl ? <span>{title}</span> : getInitials(title)}
        </AvatarFallback>
      </Avatar>
      <div className="ml-3">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">
          {designation ?? subtitle}
        </div>
      </div>
    </div>
  );
};

export default MultiLineNameCell;
