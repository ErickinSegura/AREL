import React from 'react';
import { useOverview } from '../../hooks/useOverview';
import { greeting } from '../../lib/greetings';
import {
    ErrorState,
    NoProjectState,
    DashboardHeader,
    SprintSummaryCard,
    SprintGoalCard,
    TeamPerformanceCard,
    SprintHoursChart,
    DeveloperHoursChart,
    DeveloperTasksChart, LogsCard, PDFButton
} from '../../components/overview/overviewComponents';
import {useLogs} from "../../hooks/useLogs";
import {Header} from "../../lib/ui/Header";

const AdminOverview = () => {
    const {
        user,
        selectedProject,
        loading,
        error,
        sprintOverviews,
        userPerformances,
        selectedSprint,
        selectedSprintNumber,
        sprintUserData,
        showSprintDropdown,
        setSelectedSprintNumber,
        formatDate,
        calculateProgressArc,
        toggleSprintDropdown,
        closeSprintDropdown
    } = useOverview();

    const {logs} = useLogs();

    const [currentGreeting] = React.useState(greeting());

    if (error) {
        return <ErrorState error={error} />;
    }

    if (!selectedProject) {
        return <NoProjectState title={"selected"} message={"Please select a project from the sidebar to view its overview and sprint details."}/>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <Header
                title={selectedProject.projectName}
                selectedProject={selectedProject}
                loading={loading}
                props={
                    <div className="mt-2 sm:mt-0">
                        <PDFButton
                            selectedProject={selectedProject}
                        />
                    </div>
                }
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
                <LogsCard
                    loading={loading}
                    logs={logs}
                    formatDate={formatDate}
                    />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-6">
                <DeveloperTasksChart
                    userPerformances={userPerformances}
                    loading={loading}
                />

                <DeveloperHoursChart
                    userPerformances={userPerformances}
                    loading={loading}
                />
            </div>

        </div>
    );
};

export default AdminOverview;