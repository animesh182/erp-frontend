import { Skeleton } from "@/components/ui/skeleton";

export function KpiSkeleton({
  isSmall=false
}) {
  return (
    <div className={`flex flex-col ${isSmall?"space-y-0":"space-y-3"}`}>
      <Skeleton className={`h-[125px] ${isSmall?"w-11/12":"w-full"} rounded-xl`} />
    </div>
  );
}

export function RectangleSkeleton(isSmall=false) {

  return (
    <div className="flex flex-col ">
      <Skeleton className={`${isSmall? "h-[300px]": "h-[600px]"} w-full rounded-xl`} />

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