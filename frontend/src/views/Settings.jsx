import React from 'react';
import { useSettings } from '../hooks/useSettings';
import {
  ErrorState,
  NoProjectState,
  ProjectHeader,
  SettingsForm,
  DangerZoneCard
} from '../components/settings/settingsComponents';

const ProjectSettings = () => {
  const {
    selectedProject,
    loading,
    saving,
    deleteLoading,
    error,
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    handleDeleteProject
  } = useSettings();

  if (error && !selectedProject) {
    return <ErrorState error={error} />;
  }

  if (!selectedProject) {
    return <NoProjectState
        title={"selected"}
        message={"Please select a project from the sidebar to view and edit its settings."}/>;
  }

  return (
      <div className="p-6">
        <ProjectHeader
            selectedProject={selectedProject}
            loading={loading}
        />

        <SettingsForm
            loading={loading}
            saving={saving}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
            error={error}
        />

        <DangerZoneCard
            loading={loading}
            onDeleteProject={handleDeleteProject}
            deleteLoading={deleteLoading}
            projectName={selectedProject.projectName}
        />
      </div>
  );
};

export default ProjectSettings;