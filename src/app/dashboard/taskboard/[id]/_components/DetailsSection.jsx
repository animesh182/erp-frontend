import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return format(date, "HH:mm MMM dd,");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error Formatting Date";
  }
};

const AccordionItem = ({ data }) => {
  const firstInitial = data.name ? data.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mr-3">
          {firstInitial}
        </div>
        <div className="flex-grow">
          <div className="text-sm font-semibold text-gray-800">
            {data.name}{" "}
            <span className="font-normal text-gray-500 text-xs ml-2">
              {formatDate(data.created_at)}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-700">
            {data.description || "No description provided."}
          </div>
        </div>
      </div>
    </div>
  );
};

const CollapsibleDetail = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const firstInitial = data[0]?.name
    ? data[0].name.charAt(0).toUpperCase()
    : "?";

  // Handle toggling the accordion
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      {/* Accordion Trigger (First Item with Description) */}
      <div
        className={`flex items-start cursor-pointer py-3  ${
          isExpanded && "border-b border-gray-200"
        }`}
        onClick={handleToggle}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mr-3">
          {firstInitial}
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800">
              {data[0]?.name || "Unknown"}{" "}
              <span className="font-normal text-gray-500 text-xs ml-2">
                {formatDate(data[0]?.created_at)}
              </span>
            </div>
            <div className="flex-shrink-0 ml-2 text-gray-500">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-700">
            {data[0]?.description || "No description provided."}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div>
          {data.slice(1).map((item) => (
            <AccordionItem key={item.id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollapsibleDetail;
