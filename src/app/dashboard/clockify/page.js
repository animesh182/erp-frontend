import PieChartwithBarChart from "@/components/charts/PieChartwithBarChart";
import React from "react";

const Clockify = () => {
  return (
    <div className="grid grid-cols-1 p-6 gap-4">
      <span className="font-semibold text-2xl">Clockify</span>
      <div>
        <PieChartwithBarChart />
      </div>
    </div>
  );
};

export default Clockify;
