'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ProjectSelector from '@/components/ProjectSelector';

export default function KanbanPage() {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const router = useRouter();

  const projectData = useMemo(() => [
    { value: 'alpha', label: 'Project Alpha' },
    { value: 'beta', label: 'Project Beta' },
    { value: 'gamma', label: 'Project Gamma' },
    { value: 'delta', label: 'Project Delta' },
  ], []);

  const handleProjectSelection = (projectId) => {
    setSelectedProjectId(projectId);
    router.push(`/dashboard/taskboard/${projectId}`);
  };

  if (projectData.length > 0 && !selectedProjectId) {
    handleProjectSelection(projectData[0].value);
  }

  return (
    <div>
      <div className="mb-4">
        <ProjectSelector
          title="Choose a Project"
          options={projectData}
          onValueChange={handleProjectSelection}
          placeholder="Select a Project to View"
        />
      </div>
    </div>
  );
}