import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../lib/ui/Card';
import { useOverview } from '../../hooks/useOverview';
import { greeting } from '../../lib/greetings';
import {
    ErrorState,
    NoProjectState,
    DashboardHeader,
    SprintSummaryCard,
    DevStreakCard,
    UserPerformanceItem,
    PDFButton,
    SprintGoalCard,
    SprintHoursChart,
    DeveloperHoursChart,
    DeveloperTasksChart
} from '../../components/overview/overviewComponents';
import { FiArrowUp } from 'react-icons/fi';
import { Header } from "../../lib/ui/Header";
import { useProjectUsers } from "../../hooks/useProjectUsers";
import { Skeleton, SkeletonText } from "../../lib/ui/Skeleton";
import { useAuth } from "../../contexts/AuthContext";

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
        toggleSprintDropdown,
        closeSprintDropdown,
        userPerformances,
        calculateProgressArc
    } = useOverview();

    const { users, usersLoading } = useProjectUsers(selectedProject?.id);

    const currentUserPerformances = React.useMemo(() => {
        if (!user || !userPerformances) return [];

        return userPerformances.filter(perf => perf.userProjectID === user.id);
    }, [user, userPerformances]);

    const currentUserPerformance = currentUserPerformances.find(
        perf => perf.sprintNumber === selectedSprintNumber
    ) || null;

    const [currentGreeting] = React.useState(greeting());

    if (error) {
        return <ErrorState error={error} />;
    }

    if (!selectedProject) {
        return <NoProjectState title={"assigned"} message={"Please contact an administrator."} />;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <Header
                title={selectedProject.projectName}
                selectedProject={selectedProject}
                loading={loading}
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
                            <div className="space-y-4">
                                {[1].map((i) => (
                                    <div key={i} className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex justify-between mb-2">
                                            <SkeletonText className="w-32" />
                                            <SkeletonText className="w-24" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            <SkeletonText className="h-4" />
                                            <SkeletonText className="h-4" />
                                            <SkeletonText className="h-4" />
                                        </div>
                                        <Skeleton className="w-full h-2 mt-2" />
                                    </div>
                                ))}
                            </div>
                        ) : currentUserPerformance ? (
                            <div className="flex flex-col h-full">
                                <UserPerformanceItem user={currentUserPerformance} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                No performance data available for this sprint
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <DeveloperHoursChart
                    userPerformances={currentUserPerformances}
                    loading={loading}
                />

                <DeveloperTasksChart
                    userPerformances={currentUserPerformances}
                    loading={loading}
                />
            </div>


        </div>
    );
};

export default DeveloperOverview;