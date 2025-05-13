import React from 'react';
import { useOverview } from '../../hooks/useOverview';
import { greeting } from '../../lib/greetings';
import {
    ErrorState,
    NoProjectState,
    ProjectHeader,
    DashboardHeader,
    SprintSummaryCard,
    SprintGoalCard,
    TeamPerformanceCard,
    SprintHoursChart, UserTasksChart, UserHoursChart  // Import the new component
} from '../../components/overview/overviewComponents';

const AdminOverview = () => {
    const {
        user,
        selectedProject,
        loading,
        error,
        sprintOverviews,
        selectedSprint,
        selectedSprintNumber,
        sprintUserData,
        showSprintDropdown,
        setSelectedSprintNumber,
        formatDate,
        getProjectIcon,
        calculateProgressArc,
        toggleSprintDropdown,
        closeSprintDropdown
    } = useOverview();

    const [currentGreeting] = React.useState(greeting());

    if (error) {
        return <ErrorState error={error} />;
    }

    if (!selectedProject) {
        return <NoProjectState title={"selected"} message={"Please select a project from the sidebar to view its overview and sprint details."}/>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <ProjectHeader
                selectedProject={selectedProject}
                loading={loading}
                getProjectIcon={getProjectIcon(selectedProject?.icon?.iconName)}
            />

            <DashboardHeader
                loading={loading}
                user={user}
                sprintOverviews={sprintOverviews}
                selectedSprintNumber={selectedSprintNumber}
                setSelectedSprintNumber={setSelectedSprintNumber}
                showSprintDropdown={showSprintDropdown}
                toggleSprintDropdown={toggleSprintDropdown}
                closeSprintDropdown={closeSprintDropdown}
                formatDate={formatDate}
                greeting={() => currentGreeting}
            />

            <SprintSummaryCard
                loading={loading}
                selectedSprint={selectedSprint}
                formatDate={formatDate}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-6">
                <SprintGoalCard
                    loading={loading}
                    selectedSprint={selectedSprint}
                    calculateProgressArc={calculateProgressArc}
                />

                <TeamPerformanceCard
                    loading={loading}
                    sprintUserData={sprintUserData}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-6">
                <SprintHoursChart
                    loading={loading}
                    sprintOverviews={sprintOverviews}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-6">
                <UserHoursChart
                    loading={loading}
                    sprintOverviews={sprintOverviews}
                    userPerformances={sprintUserData}
                />
                <UserTasksChart
                    loading={loading}
                    sprintOverviews={sprintOverviews}
                    userPerformances={sprintUserData}
                />
            </div>
        </div>
    );
};

export default AdminOverview;