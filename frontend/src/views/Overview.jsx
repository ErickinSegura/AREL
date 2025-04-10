import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../lib/ui/Card';
import { Button } from '../lib/ui/Button';
import {
    FiArrowUp,
    FiMoreHorizontal,
    FiFolder,
    FiCodesandbox,
    FiClock,
    FiCheckCircle,
    FiActivity,
    FiChevronDown
} from 'react-icons/fi';
import { useProjects } from '../hooks/useProjects';
import { useOverviewData } from '../hooks/useOverviewData';
import { Skeleton, SkeletonText, SkeletonCircle } from '../lib/ui/Skeleton';
import {useAuth} from "../contexts/AuthContext";

const Overview = () => {
    const { selectedProject, loading: projectLoading } = useProjects();
    const {
        sprintOverviews,
        userPerformances,
        loading: dataLoading,
        error,
        currentSprint: latestSprint,
    } = useOverviewData();

    const { user } = useAuth();


    const [selectedSprintNumber, setSelectedSprintNumber] = useState(null);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [sprintUserData, setSprintUserData] = useState([]);
    const [showSprintDropdown, setShowSprintDropdown] = useState(false);

    useEffect(() => {
        if (latestSprint && !selectedSprintNumber) {
            setSelectedSprintNumber(latestSprint.sprintNumber);
            setSelectedSprint(latestSprint);
        }
    }, [latestSprint, selectedSprintNumber]);

    useEffect(() => {
        if (selectedSprintNumber && sprintOverviews && sprintOverviews.length > 0) {
            const sprint = sprintOverviews.find(s => s.sprintNumber === selectedSprintNumber);
            if (sprint) {
                setSelectedSprint(sprint);
            }
        }
    }, [selectedSprintNumber, sprintOverviews]);

    useEffect(() => {
        if (selectedSprintNumber && userPerformances) {
            const filteredUsers = userPerformances.filter(
                perf => perf.sprintNumber === selectedSprintNumber
            ).sort((a, b) => b.completedTasks - a.completedTasks);

            setSprintUserData(filteredUsers);
        }
    }, [selectedSprintNumber, userPerformances]);

    const loading = projectLoading || dataLoading;

    const getProjectIcon = (iconName) => {
        switch (iconName) {
            case 'folder': return <FiFolder />;
            case 'codesandbox': return <FiCodesandbox />;
            default: return <FiCodesandbox />;
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            "To Do": "bg-gray-100 text-gray-800",
            "Doing": "bg-blue-100 text-blue-800",
            "Done": "bg-green-100 text-green-800"
        };

        return (
            <span className={`px-2 py-1 text-xs rounded-md ${statusMap[status] || "bg-gray-100"}`}>
                {status}
            </span>
        );
    };


    const getCompletionRateColor = (completionRate) => {
        if (completionRate >= 75) return "#10B981"; // green
        if (completionRate >= 50) return "#FBBF24"; // yellow
        return "#EF4444"; // red
    };


    const calculateProgressArc = () => {
        if (!selectedSprint) return { strokeDasharray: 0, strokeDashoffset: 0 };

        const total = selectedSprint.totalTasks || 1;
        const completed = selectedSprint.completedTasks || 0;
        const completionRate = completed / total;

        const pathLength = Math.PI * 45;
        const offset = pathLength * (1 - completionRate);

        const completionRateColor = getCompletionRateColor(completionRate * 100);

        return {
            strokeDasharray: pathLength,
            strokeDashoffset: offset,
            completionRateColor
        };
    };

    const progressArc = calculateProgressArc();
    const completionRateColor = progressArc.completionRateColor;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (error) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Error loading data</h1>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!selectedProject) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">There is not selected project</h1>
                <p>Please, select a project from the sidebar</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Project Header */}
            <Card className="mb-6">
                <CardHeader>
                    <div className={`flex items-center ${loading ? 'animate-pulse' : ''}`}>
                        <CardTitle>
                            {loading ? (
                                <div className="flex items-center">
                                    <SkeletonCircle size="md" />
                                    <div className="ml-3 w-48">
                                        <SkeletonText lines={1} />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center">
                                        <div
                                            className="w-12 h-12 rounded-md grid place-items-center text-white"
                                            style={{ backgroundColor: selectedProject.color?.hexColor || '#808080' }}
                                        >
                                            {getProjectIcon(selectedProject.icon?.iconName)}
                                        </div>
                                        <h1 className="text-2xl font-bold px-2">{selectedProject.projectName}</h1>
                                    </div>
                                </>
                            )}
                        </CardTitle>
                    </div>
                </CardHeader>
            </Card>

            <div className="flex justify-between items-center mb-6">
                {loading ? (
                    <div className="w-64">
                        <SkeletonText lines={1} />
                    </div>
                ) : (
                    <h1 className="text-2xl font-bold">
                        Good Morning, <span className="text-oracleRed">{user ? `${user.firstName} ${user.lastName}` : 'Usuario'}</span>
                    </h1>
                )}

                {/* Sprint Selector */}
                {loading ? (
                    <div className="w-32">
                        <SkeletonText lines={1} />
                    </div>
                ) : sprintOverviews && sprintOverviews.length > 0 && (
                    <div className="relative">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => setShowSprintDropdown(!showSprintDropdown)}
                        >
                            Sprint {selectedSprintNumber || '?'}
                            <FiChevronDown size={16} />
                        </Button>

                        {showSprintDropdown && (
                            <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg z-10 min-w-40">
                                {sprintOverviews
                                    .sort((a, b) => b.sprintNumber - a.sprintNumber)
                                    .map((sprint) => (
                                        <div
                                            key={sprint.sprintNumber}
                                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedSprintNumber === sprint.sprintNumber ? 'bg-gray-50 font-medium' : ''}`}
                                            onClick={() => {
                                                setSelectedSprintNumber(sprint.sprintNumber);
                                                setShowSprintDropdown(false);
                                            }}
                                        >
                                            Sprint {sprint.sprintNumber} - {formatDate(sprint.startDate)}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sprint Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {loading ? (
                            <SkeletonText className="w-40" />
                        ) : (
                            <>Sprint <span className="text-oracleRed">Summary</span></>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                                    <SkeletonText className="w-24 mb-1" />
                                    <div className="h-8 mb-1">
                                        <SkeletonText className="w-16 h-6" />
                                    </div>
                                    <SkeletonText className="w-32" />
                                </div>
                            ))}
                        </div>
                    ) : selectedSprint && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-gray-500 text-sm mb-1">Time Accuracy</div>
                                <div className="text-2xl font-bold">{selectedSprint.timeAccuracy.toFixed(0)}<span className="text-oracleRed">%</span></div>
                                <div className="text-xs text-gray-500">Est. {selectedSprint.totalEstimatedHours}h vs Actual {selectedSprint.totalRealHours}h</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-gray-500 text-sm mb-1">Completion Rate</div>
                                <div className="text-2xl font-bold">{selectedSprint.completionRate.toFixed(0)}<span className="text-oracleRed">%</span></div>
                                <div className="text-xs text-gray-500">{selectedSprint.completedTasks} of {selectedSprint.totalTasks} tasks completed</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-gray-500 text-sm mb-1">Hours on Completed</div>
                                <div className="text-2xl font-bold">{selectedSprint.totalRealHours}<span className="text-oracleRed">h</span></div>
                                <div className="text-xs text-gray-500">Time spent on finished tasks</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-gray-500 text-sm mb-1">Sprint Dates</div>
                                <div className="text-md font-bold">{formatDate(selectedSprint.startDate)} <span className="text-oracleRed">-</span> {formatDate(selectedSprint.endDate)}</div>
                                <div className="text-xs text-gray-500">Sprint duration</div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-6">
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle>
                            {loading ? (
                                <SkeletonText className="w-36" />
                            ) : (
                                <>Sprint <span className="text-oracleRed">Goal</span></>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center flex-grow justify-center">
                        {loading ? (
                            <>
                                <SkeletonCircle size="3xl" />
                                <div className="mt-4 w-40">
                                    <SkeletonText lines={1} />
                                </div>
                            </>
                        ) : selectedSprint && (
                            <>
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
                                            stroke={completionRateColor}
                                            strokeWidth="10"
                                            strokeDasharray={progressArc.strokeDasharray}
                                            strokeDashoffset={progressArc.strokeDashoffset}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
                            <span className="text-3xl font-bold">
                                {selectedSprint.completedTasks}/{selectedSprint.totalTasks}
                            </span>
                                        <span className="text-xs text-gray-500">TASKS COMPLETED</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-xs text-gray-600">
                                    {selectedSprint.completionRate >= 75 ? (
                                        <>
                                            <FiArrowUp className="text-green-500 mr-1" />
                                            <span>Great progress with {selectedSprint.completionRate.toFixed(0)}% completion rate!</span>
                                        </>
                                    ) : selectedSprint.completionRate >= 50 ? (
                                        <>
                                            <FiArrowUp className="text-yellow-500 mr-1" />
                                            <span>Decent progress at {selectedSprint.completionRate.toFixed(0)}% completion rate</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiArrowUp className="text-red-500 mr-1 transform rotate-180" />
                                            <span>Low completion rate at {selectedSprint.completionRate.toFixed(0)}%</span>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle>
                            {loading ? (
                                <SkeletonText className="w-48" />
                            ) : (
                                <>Sprint <span className="text-oracleRed">Team Performance</span></>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
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
                        ) : (
                            <div className="space-y-4 overflow-y-auto max-h-64 pr-1">
                                {sprintUserData.length > 0 ? (
                                    sprintUserData.map((user, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <div className="font-medium">{user.userName}</div>
                                                <div className={`text-sm font-semibold ${user.completionRate >= 75 ? 'text-green-500' : user.completionRate >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                    {user.completionRate.toFixed(0)}% Completion
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-xs">
                                                <div className="flex items-center justify-center">
                                                    <FiCheckCircle className="mr-1 text-blue-500" />
                                                    <span>{user.completedTasks}/{user.assignedTasks} Tasks</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <FiClock className="mr-1 text-purple-500" />
                                                    <span>{user.totalEstimatedHours}h Estimated</span>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <FiActivity className="mr-1 text-orange-500" />
                                                    <span>{user.totalRealHours}h Spent</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div
                                                    className={`h-2 rounded-full ${user.completionRate >= 75 ? 'bg-green-500' : user.completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${user.completionRate}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        No user performance data available for this sprint
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Overview;