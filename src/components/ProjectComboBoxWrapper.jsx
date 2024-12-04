import React, { useMemo, useCallback } from "react";
import ComboboxProjects from "./ProjectComboBox";

const ComboboxProjectsWrapper = ({ clockifyProjects, selectedProject, onProjectSelect }) => {
  const projectNames = useMemo(() => {
    if (!clockifyProjects) return [];
    return clockifyProjects.map((project) => project.projectName);
  }, [clockifyProjects]);

  const handleProjectSelect = useCallback(
    (project) => {
      onProjectSelect(project);
    },
    [onProjectSelect]
  );

  return (
    <ComboboxProjects
      projectNames={projectNames}
      onSelectProject={handleProjectSelect}
      prop={selectedProject}
    />
  );
};

export default ComboboxProjectsWrapper;
