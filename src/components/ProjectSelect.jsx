// "use client";
// import React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "./ui/input";

// export const ProjectSelect = ({ projectOptions, value, onChange }) => {
//   console.log(projectOptions,"options")
//   if (!projectOptions) {
//     return <Input placeholder="Add" value={value}  />;
//   }
//   console.log(projectOptions,"options")
//   // Sort projectOptions alphabetically by name
//   const sortedProjectOptions = [...projectOptions].sort((a, b) =>
//     a.name.localeCompare(b.name)
// );

// return (
//   <Select onValueChange={onChange} value={value}>
//       <SelectTrigger>
//         <SelectValue placeholder="Select Project">
//           {value || "Select Project"}
//         </SelectValue>
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           <SelectLabel>Project</SelectLabel>
//           {sortedProjectOptions.map((project) => (
//             <SelectItem key={project.id} value={project.name}>
//               {project.name}
//             </SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   );
// };


"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClockifyProjects } from "@/app/hooks/projects/useClockifyProjects";

export const ProjectSelect = ({ value, onChange}) => {
  const { data: projectOptions, isLoading } = useClockifyProjects(true);
  if ( isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading projects..." />
        </SelectTrigger>
      </Select>
    );
  }



  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select Project">
          {value || "Select Project"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Project</SelectLabel>
          {projectOptions.map((project) => (
            <SelectItem key={project.id} value={project.projectName}>
              {project.projectName} {/* Ensure the correct field is displayed */}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
