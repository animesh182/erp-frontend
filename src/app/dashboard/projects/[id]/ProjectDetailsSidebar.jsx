import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import MultiLineNameCell from "@/components/MultiLineNameCell";
import TeamAvatars from "@/components/TeamAvatars";
import { Progress } from "@/components/ui/progress";
import { useProjectClient } from "@/hooks/useProjects";

const ProjectDetailsSidebar = ({id}) => {
  const {data:projectData,isLoading,isError,error}=useProjectClient(id)

  if(isLoading) return <p>loading....</p>
  if(isError) return <p>{error.message}</p>

  return(
  <div className="rounded-md border w-full md:w-1/3 p-6 h-full space-y-6">
    <div className="text-xl font-bold text-foreground flex w-full justify-between">
      <div>Description</div>
      <Button variant="outline" size="sm" className="gap-2">
        <Edit className="h-4 w-4" />
        Edit
      </Button>
      {/* change to assign employee */}
    </div>
    <div className="text-muted-foreground text-pretty text-sm">
      {projectData.description}
    </div>
    <div className="space-y-2">
      <p className="text-sm text-foreground">Client Details</p>
      <MultiLineNameCell
        title={projectData.clientName}
        subtitle={projectData.clientEmail}
        imageUrl={"/default-avatar.jpg"}
      />
    </div>
    <div className="space-y-2">
      <p className="text-sm text-foreground">Team</p>

      <TeamAvatars
        teamMembersImage={["/default-avatar.jpg", "/default-avatar.jpg"]}
        teamMembersCount={projectData.teamMembersCount}
        size="medium"
      />
    </div>
    <div className="space-y-2">
      <p className="text-sm text-foreground">Project Progress</p>

      <div className="flex items-center gap-3">
        <Progress value={projectData.progress} className="h-1.5" />
        <span className="ml-2 text-xs">{projectData.progress}%</span>
      </div>
    </div>
  </div>
)
}

export default ProjectDetailsSidebar;
