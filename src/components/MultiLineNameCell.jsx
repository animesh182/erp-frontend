import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

const MultiLineNameCell = ({ imageUrl, title, subtitle, designation }) => {
  return (
    <div className="flex items-start">
      <Avatar>
        <AvatarImage src={imageUrl} className="object-cover" />
        <AvatarFallback>
          <span>{title}</span>
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
