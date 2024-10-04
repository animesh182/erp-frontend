import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import MultiLineNameCell from "@/components/MultiLineNameCell";
import TeamAvatars from "@/components/TeamAvatars";
import { Progress } from "@/components/ui/progress";

const ProjectDetailsSidebar = () => (
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
      Depending on the client, this may already be well-defined, but you might
      also be defining the visual style from the ground up. Tools like style
      tiles, mood boards, and element collages can help with this process.
      Testing: By now, you&apos;ve got all your pages and defined how they
      display to the site visitor, so it&apos;s time to make sure it all works.
      Combine manual browsing of the site on a variety of devices with automated
      site crawlers to identify everything from user experience issues to simple
      broken links.
    </div>
    <div className="space-y-2">
      <p className="text-sm text-foreground">Client Details</p>
      <MultiLineNameCell
        title="John Doe"
        subtitle="john.doe@example.com"
        imageUrl={"/default-avatar.jpg"}
      />
    </div>
    <div className="space-y-2">
      <p className="text-sm text-foreground">Team</p>

      <TeamAvatars
        teamMembersImage={["/default-avatar.jpg", "/default-avatar.jpg"]}
        teamMembersCount={7}
        size="medium"
      />
    </div>
    <div className="space-y-2">
      <p className="text-sm text-foreground">Project Progress</p>

      <div className="flex items-center gap-3">
        <Progress value={65} className="h-1.5" />
        <span className="ml-2 text-xs">65%</span>
      </div>
    </div>
  </div>
);

export default ProjectDetailsSidebar;
