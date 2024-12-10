import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from './ui/button';
import ProjectBudgetChart from './charts/ProjectBudget';
import ProfitLossChart from './charts/ProfitLoss';
import { useRouter } from "next/navigation";
function ProfitAnalysisMargin({
    profitLoss,
    ongoingProjects,
    completedProjects


}) {
    const router = useRouter();
    return (
    <div className="grid grid-cols-5 gap-x-6 select-none">
        <Card className="col-span-5 lg:col-span-3 h-full">
        <CardHeader className="flex-row justify-between items-center">
            <CardTitle>
            Profit & Loss
            <div className="text-sm font-normal text-muted-foreground">
                This chart provides a financial overview of the company
            </div>
            </CardTitle>
            <Button
            onClick={() => router.push("/dashboard/finances/projection")}
            >
            View More
            </Button>
        </CardHeader>
        <CardContent className="p-0 w-full h-[600px]">
            <ProfitLossChart data={profitLoss} />
        </CardContent>
        </Card>
        <Card className="col-span-5 lg:col-span-2 h-full">
        <CardHeader className="flex-row justify-between items-center pb-0 ">
            <CardTitle>
            Project Profit Margin 
            <div className="text-sm font-normal text-muted-foreground">
                This chart provides a financial health of specific projects
            </div>
            </CardTitle>
        </CardHeader>
        <CardContent className="w-full h-5/6 overflow-hidden px-4 flex justify-center">
            <Tabs
            defaultValue="ongoing"
            className="w-full h-full flex flex-col"
            >
            <TabsList className="self-end">
                <TabsTrigger value="ongoing" className="text-xs">
                Ongoing
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs">
                Completed
                </TabsTrigger>
            </TabsList>
            <TabsContent value="ongoing" className="h-full">
                <ProjectBudgetChart rawData={ongoingProjects} />
            </TabsContent>
            <TabsContent value="completed" className="h-full">
                <ProjectBudgetChart rawData={completedProjects} />
            </TabsContent>
            </Tabs>
        </CardContent>
        </Card>
    </div>
    )
}

export default ProfitAnalysisMargin
