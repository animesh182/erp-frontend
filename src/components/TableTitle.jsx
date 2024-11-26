import React from "react";

const TableTitle = ({ title, subtitle, totalItemCount }) => {
  return (
    <div className="flex items-start w-full mb-8">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-muted-foreground text-xs bg-green-400 text-white font-semibold rounded-full px-2 py-0">
            {totalItemCount}
          </span>
        </div>
        <p className="text-muted-foreground text-sm hidden lg:block">{subtitle}</p>
      </div>
    </div>
  );
};

export default TableTitle;
