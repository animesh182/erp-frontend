import { Skeleton } from "@/components/ui/skeleton";

export function KpiSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
    </div>
  );
}

export function RectangleSkeleton() {
  return (
    <div className="flex flex-col ">
      <Skeleton className="h-full w-full rounded-xl" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-96 w-[1200px] rounded-xl" />
      {/* <div className="space-y-2">
        <Skeleton className="h-96 w-[850px]" />
        <Skeleton className="h-96 w-[850px]" />
      </div> */}
    </div>
  );
}
