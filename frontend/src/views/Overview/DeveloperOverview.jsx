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
    DevStreakCard,
    UserPerformanceItem
} from '../../components/overview/overviewComponents';
import { FiArrowUp } from 'react-icons/fi';

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
        closeSprintDropdown,
        currentUserPerformance,
        calculateProgressArc
    } = useOverview();

    const [currentGreeting] = React.useState(greeting());

    const calculateUserProgressArc = () => {
        return calculateProgressArc(currentUserPerformance);
    };

    if (error) {
        return <ErrorState error={error} />;
    }

    if (!selectedProject) {
        return <NoProjectState title={"assigned"} message={"Please contact an administrator."} />;
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
                                <>Your Sprint <span className="text-oracleRed">Performance</span></>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        {loading ? (
                            <div className="bg-gray-50 p-3 rounded-lg animate-pulse">
                                <div className="flex justify-between mb-2">
                                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full mt-2"></div>
                            </div>
                        ) : currentUserPerformance ? (
                            <div className="flex flex-col h-full">
                                <UserPerformanceItem user={currentUserPerformance} />

                                <div className="mt-6 flex flex-col items-center justify-center flex-grow">
                                    <div className="relative w-60 h-36 mb-4">
                                        <svg className="w-full h-full" viewBox="0 0 100 50">
                                            <path
                                                d="M5,45 A45,45 0 0,1 95,45"
                                                fill="transparent"
                                                stroke="#f0f0f0"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M5,45 A45,45 0 0,1 95,45"
                                                fill="transparent"
                                                stroke={calculateUserProgressArc().completionRateColor}
                                                strokeWidth="10"
                                                strokeDasharray={calculateUserProgressArc().strokeDasharray}
                                                strokeDashoffset={calculateUserProgressArc().strokeDashoffset}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
                                            <span className="text-3xl font-bold">
                                                {currentUserPerformance.completedTasks}/{currentUserPerformance.assignedTasks}
                                            </span>
                                            <span className="text-xs text-gray-500">TASKS COMPLETED</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-600">
                                        {currentUserPerformance.completionRate >= 75 ? (
                                            <>
                                                <FiArrowUp className="text-green-500 mr-1" />
                                                <span>Great job! {currentUserPerformance.completionRate.toFixed(0)}% completion rate!</span>
                                            </>
                                        ) : currentUserPerformance.completionRate >= 50 ? (
                                            <>
                                                <FiArrowUp className="text-yellow-500 mr-1" />
                                                <span>Good progress at {currentUserPerformance.completionRate.toFixed(0)}% completion rate</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiArrowUp className="text-red-500 mr-1 transform rotate-180" />
                                                <span>You're at {currentUserPerformance.completionRate.toFixed(0)}% completion rate</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                No performance data available for this sprint
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DeveloperOverview;