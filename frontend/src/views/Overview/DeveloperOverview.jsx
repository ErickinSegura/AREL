import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../lib/ui/Card';
import { useOverview } from '../../hooks/useOverview';
import { greeting } from '../../lib/greetings';
import {
    ErrorState,
    NoProjectState,
    ProjectHeader,
    DashboardHeader,
    SprintSummaryCard,
    DevStreakCard
} from '../../components/overview/overviewComponents';

const DeveloperOverview = () => {
    const {
        user,
        selectedProject,
        loading,
        error,
        sprintOverviews,
        selectedSprint,
        selectedSprintNumber,
        setSelectedSprintNumber,
        showSprintDropdown,
        formatDate,
        getProjectIcon,
        toggleSprintDropdown,
        closeSprintDropdown
    } = useOverview();

    const [currentGreeting] = React.useState(greeting());


    if (error) {
        return <ErrorState error={error} />;
    }

    if (!selectedProject) {
        return <NoProjectState title={"assigned"} message={"Please contact an administrator."} />;
    }

    return (
        <div className="p-6">
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
                <DevStreakCard
                    loading={loading}
                    selectedSprint={selectedSprint}
                />

                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle>
                            {loading ? (
                                <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                                <>Your Sprint <span className="text-oracleRed">Goal</span></>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        {loading ? (
                            <>
                                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto animate-pulse"></div>
                                <div className="mt-4 w-40 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
                            </>
                        ) : (
                            <div className="space-y-4 overflow-y-auto max-h-64 pr-1">
                                {/* TODO: Goal Content */}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DeveloperOverview;