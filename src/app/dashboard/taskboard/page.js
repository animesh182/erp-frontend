"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectSelector from "@/components/ProjectSelector";
import { useQuery } from "@tanstack/react-query";
import { getBoards } from "@/app/api/taskboard/navbarSelector/getBoard";
import { KanbanBoardSkeleton } from "@/components/Skeletons";

export default function KanbanPage() {
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const router = useRouter();

  const { data: boardData } = useQuery({
    queryKey: ["boardData"],
    queryFn: getBoards,
  });

  useEffect(() => {
    if (boardData?.data?.length > 0 && !selectedBoardId) {
      const firstBoardName = boardData.data[0].id;
      setSelectedBoardId(firstBoardName);
      router.push(`/dashboard/taskboard/${firstBoardName}`);
    }
  }, [boardData, selectedBoardId, router]);

  if (!boardData) {
    return <KanbanBoardSkeleton />;
  }

  return (
    <div>
      <div className="mb-4">
        <ProjectSelector
          title="Choose a Board"
          options={
            boardData?.data?.map((board) => ({
              value: board.id,
              label: board.name,
            })) || []
          }
          placeholder="Select a Board to View"
        />
      </div>
    </div>
  );
}
