"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabFilters = ({ filterValues, selectedTab, setSelectedTab }) => {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="flex space-x-4 w-max">
        {filterValues.map((value) => (
          <TabsTrigger key={value} value={value}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TabFilters;
