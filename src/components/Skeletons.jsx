import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function KpiSkeleton({ isSmall = false }) {
  return (
    <div className={`flex flex-col ${isSmall ? "space-y-0" : "space-y-3"}`}>
      <Skeleton
        className={`h-[125px] ${isSmall ? "w-11/12" : "w-full"} rounded-xl`}
      />
    </div>
  );
}

export function RectangleSkeleton({ isSmall = false }) {
  console.log(isSmall, "small");
  return (
    <div className="flex flex-col ">
      <Skeleton
        className={`${isSmall ? "h-[300px]" : "h-[600px]"} w-full rounded-xl`}
      />
      {/* <Skeleton className="h-[600px] w-full rounded-xl" /> */}
    </div>
  );
}

export function ProjectPageSkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-screen w-full rounded-xl" />
      {/* <Skeleton className="h-[400px] w-[1400px] rounded-xl" /> */}
      {/* <div className="space-y-2">
        <Skeleton className="h-96 w-[850px]" />
        <Skeleton className="h-96 w-[850px]" />
      </div> */}
    </div>
  );
}
export function DetailsSkeleton() {
  return (
    <div className="space-y-4 p-6 border rounded-lg w-full">
      <Skeleton className="h-5 w-1/3 rounded" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
      </div>
    </div>
  );
}

export function CompensationSkeleton() {
  return (
    <div className="space-y-4 p-6 border rounded-lg w-full">
      <Skeleton className="h-5 w-1/3 rounded" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
      </div>
    </div>
  );
}
export function TitleSkeleton() {
  return (
    <div className="flex flex-col ">
      <Skeleton className="h-10 w-[350px] rounded-xl" />
    </div>
  );
}
export function LargeTitleSkeleton() {
  return (
    <div className="flex flex-col ">
      <Skeleton className="h-10 w-[400px] rounded-lg" />
    </div>
  );
}
export function ProfitAnalysisMarginSkeleton() {
  return (
    <div className="grid grid-cols-5  justify-between gap-x-6 h-[600px]">
      <Skeleton className="w-[] lg:col-span-3 h-full" />
      <Skeleton className="col-span-5 lg:col-span-2 h-full" />
    </div>
  );
}

export function SimpleSkeleton() {
  return (
    // <div className="flex flex-col ">
    <Skeleton className="h-[125px] w-full rounded-xl" />
    // </div>
  );
}

export function ProjectSelectorSkeleton() {
  return (
    <div className="flex flex-row gap-2 align-center justify-between p-4 animate-pulse">
      <div className="flex flex-row gap-4 items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-40" />
      </div>

      <div className="flex flex-row gap-4 items-center">
        <Skeleton className="h-6 w-10 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}

function ColumnSkeleton() {
  return (
    <div className="w-[350px] min-w-[350px] h-full rounded-lg bg-secondary/30 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto flex-grow">
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

export function KanbanBoardSkeleton() {
  return (
    <div className="flex flex-col w-full h-[90vh] overflow-hidden animate-pulse">
      <ProjectSelectorSkeleton />

      <Card className="flex-grow bg-background m-2 p-2">
        <div className="flex w-full items-start overflow-hidden px-4 py-4 bg-background h-full">
          <div className="flex gap-4 h-full overflow-x-hidden">
            <ColumnSkeleton />
            <ColumnSkeleton />
            <ColumnSkeleton />
          </div>

          <Skeleton className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-secondary/30 border-2 border-border p-4 flex gap-2" />
        </div>
      </Card>
    </div>
  );
}
