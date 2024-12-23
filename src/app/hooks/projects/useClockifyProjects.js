import { getClockifyIdProjects } from "@/app/api/projects/getProjects";
import { useQuery } from "@tanstack/react-query";

    export const useClockifyProjects = (getAllProjects = false) => {
    return useQuery({
        queryKey: ["clockifyProjects", { getAllProjects }],
        queryFn: getClockifyIdProjects,
        select: (data) => {
        if (getAllProjects) {
            return data.map((project) => ({
            projectId: project.clockify_id,
            projectName: project.name,
            }));
        }

        const projectsById = new Map();

        data.forEach((project) => {
            if (!projectsById.has(project.clockify_id)) {
            projectsById.set(project.clockify_id, [project]);
            } else {
            projectsById.get(project.clockify_id).push(project);
            }
        });

        const formattedData = Array.from(projectsById.values()).map((projects) => {
            if (projects.length > 1) {
            const firstName = projects[0].name.split(" ")[0];
            return {
                projectId: projects[0].clockify_id,
                projectName: firstName,
            };
            } else {
            return {
                projectId: projects[0].clockify_id,
                projectName: projects[0].name,
            };
            }
        });

        return formattedData;
        },
    });
    };
