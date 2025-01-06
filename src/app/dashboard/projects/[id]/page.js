"use client";

import { deleteResourceUtilization } from "@/app/api/projects/deleteResourceUtilization";
import { useProjectById } from "@/app/hooks/projects/useProjects";
import DateRangePicker from "@/components/DateRangePicker";
import TabFilters from "@/components/TabFilters";
import TableTitle from "@/components/TableTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SimpleDataTable from "@/components/ui/simple-data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDateRange } from "@/context/dateRangeContext/DateRangeContext";
import { format, isAfter } from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { columns } from "./Columns";
import ProjectDetailsMain from "./ProjectDetailsMain";
import ProjectDetailsSidebar from "./ProjectDetailsSidebar";
import { KpiSkeleton, ProjectPageSkeletonCard, RectangleSkeleton, SimpleSkeleton } from "@/components/Skeletons";

export default function ProjectDetails() {
  const [error, setError] = useState(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Ongoing');
  const { id } = useParams();
    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
    const{data:project,isLoading:loading,refetch:refetchProject}=useProjectById(id ,  format(startDate, "yyyy-MM-dd"),format(endDate, "yyyy-MM-dd"))
    const handleDateChange = (newStartDate, newEndDate) => {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    };
  


  const getResourceStatus = (endDate) => {
    if (!endDate) return "Ongoing"; // No end date means ongoing
    
    const currentDate = new Date();
    const resourceEndDate = new Date(endDate);
    
    return isAfter(currentDate, resourceEndDate) ? "Completed" : "Ongoing";
  };

  // Filter resources based on selected tab
  const filterResourcesByStatus = (resources, status) => {
    // if (status === 'All') return resources;
    
    return resources.filter(resource => {
      const resourceStatus = getResourceStatus(resource.end_date);
      return resourceStatus === status;
    });
  };


  const onDeleteRow = async (resourceId) => {
    try {
      await deleteResourceUtilization(resourceId);
      toast.success("Resource utilization deleted successfully");
      refetchProject()
    } catch (error) {
      toast.error("Error deleting resource utilization");
      console.error("Error deleting resource utilization:", error);
    }
  };

  const filterValues = [ 'Ongoing', 'Completed'];

  // Filter the resources based on selected tab
  const filteredResources = project 
    ? filterResourcesByStatus(project.all_user_projects, selectedTab) 
    : [];



  return (


              <main className="p-6 min-h-screen space-y-4">
                <div className="flex justify-end">
                    <DateRangePicker
                          // numberOfMonths={2}
                          onDateChange={handleDateChange}
                          initialStartDate={startDate}
                          initialEndDate={endDate}
                          isMonthPicker={true}
                        />
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
                {loading ? (
            <div className="w-2/3 space-y-6">
              <RectangleSkeleton isSmall />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <SimpleSkeleton key={i} />
                ))}
              </div>
            </div>
          )

          
          :
              <ProjectDetailsMain project={project} />}
        {!isDescriptionOpen && !loading && (
          <Button onClick={() => setIsDescriptionOpen(true)} variant="outline">
            Description
          </Button>
        )}
        {isDescriptionOpen && (
          <ProjectDetailsSidebar
            project={project}
            onClose={() => setIsDescriptionOpen(false)}
          />
        )}
      </div>
      {loading?<ProjectPageSkeletonCard/>:
      <div className="">
        
        <Card>
             <Tabs defaultValue="utilization" className="mt-10">
              <CardHeader>
  <TabsList className="flex justify-start w-fit gap-4 h-fit">
    <TabsTrigger value="utilization" className="flex items-center gap-2">
    <h2 className="text-lg font-semibold">Resource Utilization</h2>
      <span className="text-muted-foreground text-xs bg-green-400 text-white font-semibold rounded-full px-2 py-0">
            {filteredResources?.length}
          </span>
    </TabsTrigger>
    <TabsTrigger value="expense">
    <h2 className="text-lg font-semibold">Resource Expense</h2>
    </TabsTrigger>
  </TabsList>
  </CardHeader>
  <CardContent>
  <TabsContent value="utilization" className="mt-4">
    <div className="flex justify-between">
    <TableTitle
      subtitle="List of all employees in the project"
      // totalItemCount={filteredResources.length}
    />
    
           <TabFilters
          filterValues={filterValues}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        </div>
    <SimpleDataTable
      columns={columns}
      data={filteredResources}
      onDeleteRow={onDeleteRow}
    />
  </TabsContent>

  <TabsContent value="expense" className="mt-4">
    <TableTitle
      subtitle="List of expense of all employees in the project"
    />
    <div className="text-lg font-medium text-center">
      Expense data will be available soon.
    </div>
  </TabsContent>
  </CardContent>
</Tabs>
</Card>

      </div>}
    </main>
  );
}