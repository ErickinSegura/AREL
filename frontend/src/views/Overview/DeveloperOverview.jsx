import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../lib/ui/Card';
import { Button } from '../../lib/ui/Button';
import {
    FiFolder,
    FiCodesandbox,
    FiChevronDown, FiRefreshCw, FiAlertTriangle
} from 'react-icons/fi';
import { BsFire } from "react-icons/bs";
import { useProjects } from '../../hooks/useProjects';
import { useOverviewData } from '../../hooks/useOverviewData';
import {SkeletonText, SkeletonCircle} from '../../lib/ui/Skeleton';
import { useAuth } from "../../contexts/AuthContext";
import { greeting } from '../../lib/greetings';

const DeveloperOverview = () => {
    const { selectedProject, loading: projectLoading, projectsLoading } = useProjects();
    const {
        sprintOverviews,
        loading: dataLoading,
        error,
        currentSprint: latestSprint,
    } = useOverviewData();

    const { user } = useAuth();

    const [selectedSprintNumber, setSelectedSprintNumber] = useState(null);
    const [selectedSprint, setSelectedSprint] = useState(null);
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


    const loading = projectLoading || dataLoading || projectsLoading;

    const getProjectIcon = (iconName) => {
        switch (iconName) {
            case 'folder': return <FiFolder />;
            case 'codesandbox': return <FiCodesandbox />;
            default: return <FiCodesandbox />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (error) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Error <span className="text-oracleRed">Loading Data</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                <FiAlertTriangle size={32} />
                            </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg mb-6">
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => window.location.reload()}
                        >
                            <FiRefreshCw size={16} />
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!selectedProject) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            No Project <span className="text-oracleRed">Selected</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <FiFolder size={32} />
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Please select a project from the sidebar to view its overview and sprint details.
                        </p>
                    </CardContent>
                </Card>
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
                        {greeting()}, <span className="text-oracleRed">{user ? `${user.firstName} ${user.lastName}` : 'Usuario'}</span>
                    </h1>
                )}

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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                                <>Dev <span className="text-oracleRed">Streak</span></>
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
                                <div className="relative mb-4">
                                    <BsFire size={80} className="text-orange-500" />
                                </div>

                                <div className="text-center">
                                    <h1 className="text-4xl font-bold mb-2">
                                        <span className="text-oracleRed">10</span> Days
                                    </h1>
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
                                <>Your Sprint <span className="text-oracleRed">Goal</span></>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        {loading ? (
                            <>
                                <SkeletonCircle size="3xl" />
                                <div className="mt-4 w-40">
                                    <SkeletonText lines={1} />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4 overflow-y-auto max-h-64 pr-1">
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DeveloperOverview;