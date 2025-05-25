import React from 'react';
import { useSettings } from '../hooks/useSettings';
import {
    ErrorState,
    NoProjectState,
    ProjectHeader,
    SettingsForm,
    DangerZoneCard,
    ProjectUsers, ProjectCategories
} from '../components/settings/settingsComponents';
import {Header} from "../lib/ui/Header";

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
        <div className="container mx-auto px-4 py-6">
            <Header
                title="Project"
                marked={"Settings"}
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

            <ProjectUsers
                projectId={selectedProject.id}
                loading={loading}
            />

            <ProjectCategories
                loading={loading}
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