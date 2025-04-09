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
import { Skeleton, SkeletonText, SkeletonCard, SkeletonCircle } from '../lib/ui/Skeleton';

const Overview = () => {
    const { selectedProject, loading: projectLoading } = useProjects();
    const {
        sprintOverviews,
        userPerformances,
        loading: dataLoading,
        error,
        currentSprint: latestSprint,
        tasks,
        progressStats,
        devStreak
    } = useOverviewData();

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

    const getPriorityIndicator = (priority) => {
        return priority === "High" ? (
            <div className="flex items-center">
                <span className="flex h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                <span className="text-xs text-red-500">High Priority</span>
            </div>
        ) : (
            <div className="flex items-center">
                <span className="flex h-2 w-2 bg-blue-500 rounded-full mr-1"></span>
                <span className="text-xs text-blue-500">Low Priority</span>
            </div>
        );
    };

    const getUserName = () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                return user.name || "Developer";
            }
        } catch (e) {
            console.error("Error getting user from localStorage:", e);
        }
        return "Developer";
    };

    const userName = getUserName();

    const calculateProgressArc = () => {
        if (!selectedSprint) return { strokeDasharray: 0, strokeDashoffset: 0 };

        const total = selectedSprint.totalTasks || 1;
        const completed = selectedSprint.completedTasks || 0;
        const completionRate = completed / total;

        const circumference = 2 * Math.PI * 45;
        const offset = circumference * (1 - completionRate);

        return {
            strokeDasharray: circumference,
            strokeDashoffset: offset
        };
    };

    const progressArc = calculateProgressArc();

    // Format date to readable string
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (error) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Error al cargar datos</h1>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!selectedProject) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">No hay proyecto seleccionado</h1>
                <p>Por favor, selecciona un proyecto desde el menú lateral.</p>
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
                                    <div
                                        className="w-12 h-12 rounded-md grid place-items-center text-white"
                                        style={{ backgroundColor: selectedProject.color?.hexColor || '#808080' }}
                                    >
                                        {getProjectIcon(selectedProject.icon?.iconName)}
                                    </div>
                                    <h1 className="text-2xl font-bold">{selectedProject.projectName}</h1>
                                </>
                            )}
                        </CardTitle>
                    </div>
                </CardHeader>
            </Card>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Good Morning, <span className="text-red-500">{userName}</span>
                </h1>

                {/* Sprint Selector */}
                {!loading && sprintOverviews && sprintOverviews.length > 0 && (
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
                                    .filter(sprint => sprint.totalTasks > 0)
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Dev Streak Card */}
                <Card className="flex flex-col items-center justify-center py-6">
                    <CardHeader>
                        <CardTitle className="text-center">Dev Streak</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center pt-4">
                        {loading ? (
                            <>
                                <SkeletonCircle size="xl" />
                                <div className="mt-4 w-24">
                                    <SkeletonText lines={1} />
                                </div>
                                <div className="mt-2 w-40">
                                    <SkeletonText lines={1} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-orange-500 mb-2">
                                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M32 12C32 12 35.6 20 40 24C44.4 28 52 32 52 32C52 32 44.4 36 40 40C35.6 44 32 52 32 52C32 52 28.4 44 24 40C19.6 36 12 32 12 32C12 32 19.6 28 24 24C28.4 20 32 12 32 12Z" fill="currentColor"/>
                                    </svg>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-orange-500 text-4xl font-bold">{devStreak}</span>
                                    <span className="text-2xl ml-2">Days</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    {devStreak > 5 ? "You are in the top dev streak rank!" : "Keep going to reach the top rank!"}
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Goal Progress Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sprint <span className="text-red-500">{selectedSprintNumber || '?'}</span> Goal</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        {loading ? (
                            <>
                                <SkeletonCircle size="3xl" />
                                <div className="mt-4 w-40">
                                    <SkeletonText lines={1} />
                                </div>
                            </>
                        ) : selectedSprint && (
                            <>
                                <div className="relative w-40 h-40 mb-4">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="transparent"
                                            stroke="#f0f0f0"
                                            strokeWidth="10"
                                        />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="transparent"
                                            stroke="#10B981"
                                            strokeWidth="10"
                                            strokeDasharray={progressArc.strokeDasharray}
                                            strokeDashoffset={progressArc.strokeDashoffset}
                                            strokeLinecap="round"
                                            transform="rotate(-90 50 50)"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Team Performance Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Sprint <span className="text-red-500">{selectedSprintNumber || '?'}</span> Team Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                            <div className="space-y-4">
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
                                                <div className="flex items-center">
                                                    <FiCheckCircle className="mr-1 text-blue-500" />
                                                    <span>{user.completedTasks}/{user.assignedTasks} Tasks</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FiClock className="mr-1 text-purple-500" />
                                                    <span>{user.totalRealHours}h Spent</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FiActivity className="mr-1 text-orange-500" />
                                                    <span>{user.timeAccuracyPercentage.toFixed(0)}% Time Accuracy</span>
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

                {/* Tasks Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            Sprint <span className="text-red-500">{selectedSprintNumber || '?'}</span> Tasks
                        </CardTitle>
                        <Button size="small" className="text-sm">SEE ALL</Button>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-gray-50 p-3 rounded-md">
                                        <div className="flex justify-between">
                                            <div className="flex items-center space-x-3">
                                                <SkeletonText className="w-16" />
                                                <SkeletonText className="w-32" />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <SkeletonText className="w-16" />
                                                <SkeletonText className="w-24" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tasks.length > 0 ? (
                                    tasks.map(task => (
                                        <div key={task.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-xs font-mono text-gray-500">{task.id}</div>
                                                <div className="text-sm">{task.title}</div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getStatusBadge(task.status)}
                                                {getPriorityIndicator(task.priority)}
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <FiMoreHorizontal />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No tasks found for the current sprint
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Sprint Stats Summary */}
            {!loading && selectedSprint && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Sprint <span className="text-red-500">{selectedSprint.sprintNumber}</span> Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-gray-500 text-sm mb-1">Time Accuracy</div>
                                <div className="text-2xl font-bold">{selectedSprint.timeAccuracy.toFixed(0)}%</div>
                                <div className="text-xs text-gray-500">Est. {selectedSprint.totalEstimatedHours}h vs Actual {selectedSprint.totalRealHours}h</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-gray-500 text-sm mb-1">Completion Rate</div>
                                <div className="text-2xl font-bold">{selectedSprint.completionRate.toFixed(0)}%</div>
                                <div className="text-xs text-gray-500">{selectedSprint.completedTasks} of {selectedSprint.totalTasks} tasks completed</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-gray-500 text-sm mb-1">Hours on Completed</div>
                                <div className="text-2xl font-bold">{selectedSprint.hoursSpentOnCompleted}h</div>
                                <div className="text-xs text-gray-500">Time spent on finished tasks</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-gray-500 text-sm mb-1">Sprint Dates</div>
                                <div className="text-md font-bold">{formatDate(selectedSprint.startDate)} - {formatDate(selectedSprint.endDate)}</div>
                                <div className="text-xs text-gray-500">Sprint duration</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Overview;