  "use client";


  import {
    Card,
    CardContent,

  } from "@/components/ui/card";
  import ClockifyPieChart from "./ClockifyPieChart";
  import ClockifyBarChart from "./ClockifyBarChart";

  const chartConfig = {
    desktop: {
      label: "Duration",
      color: "hsl(var(--chart-1))",
    }
  };

  function PieChartwithBarChart({chartData}) {
    return (
      // <Card className="flex justify-between items-center gap-6 pr-6 w-full h-full">
      <Card className="grid grid-cols-8 justify-between items-center gap-6 pr-6 w-fit h-fit">

  <div className="col-span-3 flex justify-center items-center h-full "> 
    <CardContent className="p-0 w-full h-full "> 
      <ClockifyPieChart chartConfig={chartConfig} chartData={chartData}/>
    </CardContent>
  </div>

        {/* <div className="flex-1 "> */}
        <div className="col-span-5   ">
          <CardContent className="">
          <ClockifyBarChart chartConfig={chartConfig} chartData={chartData}/>

          </CardContent>
        </div>
      </Card>
    );
  }

  export default PieChartwithBarChart;
