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
import { endOfMonth, format, isAfter, startOfMonth } from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { columns } from "./Columns";
import ProjectDetailsMain from "./ProjectDetailsMain";
import ProjectDetailsSidebar from "./ProjectDetailsSidebar";
import { KpiSkeleton, ProjectPageSkeletonCard, RectangleSkeleton, SimpleSkeleton } from "@/components/Skeletons";
import { expenseColumns } from "./ExpenseColumns";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { formatAmountToNOK } from "@/lib/utils";

export default function ProjectDetails() {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  
  const { id } = useParams();
    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
        const formattedStartDate = startDate ? format(new Date(startDate), "yyyy-MM-dd") :  "";;
        const formattedEndDate = endDate ? format(new Date(endDate), "yyyy-MM-dd") :  "";
    const{data:project,isLoading:loading,refetch:refetchProject}=useProjectById(id ,  formattedStartDate,formattedEndDate)
    // const{data:project,isLoading:loading,refetch:refetchProject}=useProjectById(id ,  format(startDate, "yyyy-MM-dd"),format(endDate, "yyyy-MM-dd"))
    const handleDateChange = (newStartDate, newEndDate) => {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
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

  const filteredTransactionResource = project 
    ? (project.resource_cost_streams) 
    : [];

    console.log(filteredTransactionResource,"resosooso")

    const categorizedResources = {
      itCost: [],
      salary: [],
      general: [],
    };

    filteredTransactionResource.forEach((resource) => {
      const sourceLower = resource.source.toLowerCase();
      if(resource.transaction_type==="Revenue")
        categorizedResources.general.push(resource);
  
      else if  (sourceLower.includes("salary")) {
        categorizedResources.salary.push(resource);
      } else {
        categorizedResources.itCost.push(resource);
      }
    });
    
    // filteredTransactionResource.forEach((resource) => {
    //   const sourceLower = resource.source.toLowerCase();
    //   if (sourceLower.includes("it cost")) {
    //     categorizedResources.itCost.push(resource);
    //   } else if (sourceLower.includes("salary")) {
    //     categorizedResources.salary.push(resource);
    //   } else {
    //     categorizedResources.general.push(resource);
    //   }
    // });
  return (


              <main className="p-6 min-h-screen space-y-4">
                <div className="flex justify-between">
                  <Link className="flex text-muted-foreground" href="/dashboard/projects"> 
                        <ChevronLeft/>All Projects
                  </Link>

                    <DateRangePicker
                          // numberOfMonths={2}
                          onDateChange={handleDateChange}
                          initialStartDate={startDate}
                          initialEndDate={endDate}
                          isMonthPicker={true}
                          allDate={true}
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
            {project?.all_user_projects?.length}
          </span>
    </TabsTrigger>
    <TabsTrigger value="expense" className="flex items-center gap-2">
    <h2 className="text-lg font-semibold">Revenue-cost Streams</h2>
    <span className="text-muted-foreground text-xs bg-green-400 text-white font-semibold rounded-full px-2 py-0">
            {filteredTransactionResource?.length}
          </span>
    </TabsTrigger>
  </TabsList>
  </CardHeader>
  <CardContent>
  <TabsContent value="utilization" className="mt-4">
    <div className="flex justify-between items-center">
    <TableTitle
      subtitle="List of all employees in the project"
      // totalItemCount={filteredResources.length}
    />
    
        </div>
    <SimpleDataTable
      columns={columns}
      data={project?.all_user_projects}
      onDeleteRow={onDeleteRow}
    />
  </TabsContent>

  <TabsContent value="expense" className="mt-4">
  <div className="flex justify-between items-center">
    <TableTitle
      subtitle="List of revenue and cost associated with the project"
    />
      </div>
      <CategorizedTransactionAccordion
    categorizedResources={categorizedResources}
    onDeleteRow={onDeleteRow}
    expenseColumns={expenseColumns}
  />
  </TabsContent>
  </CardContent>
</Tabs>
</Card>

      </div>}
    </main>
  );
}


const CategorizedTransactionAccordion = ({ categorizedResources, onDeleteRow, expenseColumns }) => {
  const calculateSum = (resources) => {
    return resources.reduce((total, resource) => total + resource.amount, 0).toFixed(2);
  };

  const sections = [
    {
      value: 'general',
      title: 'Revenue',
      data: categorizedResources.general,
      sum: calculateSum(categorizedResources.general),
      bgColor: 'bg-[#FFF5E6]/30',
      contentColor: 'bg-[#FFF5E6]/10',
      hoverColor: 'hover:bg-[#FFF5E6]',
      
    },
    {
      value: 'itCost',
      title: 'Office Expense',
      data: categorizedResources.itCost,
      sum: calculateSum(categorizedResources.itCost),
      bgColor: 'bg-[#EEF4FF]/30',
      contentColor: 'bg-[#EEF4FF]/10',
      hoverColor: 'hover:bg-[#EEF4FF]',
    },
    {
      value: 'salary',
      title: 'Employee Salary',
      data: categorizedResources.salary,
      sum: calculateSum(categorizedResources.salary),
      bgColor: 'bg-[#E9F7EF]/30',
      contentColor: 'bg-[#E9F7EF]/10',
      hoverColor: 'hover:bg-[#E9F7EF]',
    }
  ];
  return (
    <Accordion type="single" collapsible>
      {sections.map((section) => (
  <AccordionItem key={section.value} value={section?.value}>
  <AccordionTrigger className={`m-2 ${section?.bgColor} rounded-2xl p-5 hover:no-underline ${section?.hoverColor} hover:text-black`}>
    <div className="flex items-center gap-2  w-1/2">
    <h2 className=" text-start">{section?.title} </h2>
    <span className="text-muted-foreground text-xs bg-green-400 text-white font-semibold rounded-full px-2 py-0">
            {section?.data?.length}
          </span>
          </div>
    <p className="w-1/2 text-end mr-10">{formatAmountToNOK(section?.sum)}</p>
  </AccordionTrigger>
  <AccordionContent className={`m-2 ${section?.contentColor} rounded-2xl p-5`}>
    <SimpleDataTable
      columns={expenseColumns}
      data={section?.data}
      onDeleteRow={onDeleteRow}
    />
  </AccordionContent>
</AccordionItem>
      ))}
    </Accordion>
  );
};