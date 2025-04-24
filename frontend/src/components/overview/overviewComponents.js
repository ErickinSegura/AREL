import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../lib/ui/Card';
import { Button } from '../../lib/ui/Button';
import {
    FiFolder,
    FiCodesandbox,
    FiChevronDown,
    FiRefreshCw,
    FiAlertTriangle,
    FiArrowUp
} from 'react-icons/fi';
import { Skeleton, SkeletonText, SkeletonCircle } from '../../lib/ui/Skeleton';

const getProjectIcon = (iconID) => {
    switch (iconID) {
        case 1: return <FiFolder />;
        case 2: return <FiCodesandbox />;
        default: return <FiCodesandbox />;
    }
};

export const ErrorState = ({ error }) => (
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

export const NoProjectState = ( { title, message } ) => (
    <div className="p-6 flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle className="text-2xl">
                    No Project <span className="text-oracleRed">{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <FiFolder size={32} />
                    </div>
                </div>
                <p className="text-gray-600 mb-6">
                    { message }
                </p>
            </CardContent>
        </Card>
    </div>
);

export const ProjectHeader = ({ selectedProject, loading }) => (
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
                        <div className="flex items-center">
                            <div
                                className="w-12 h-12 rounded-md grid place-items-center text-white"
                                style={{ backgroundColor: selectedProject?.color?.hexColor || '#808080' }}
                            >
                                {getProjectIcon(selectedProject?.icon)}
                            </div>
                            <h1 className="text-2xl font-bold px-2">{selectedProject?.projectName}</h1>
                        </div>
                    )}
                </CardTitle>
            </div>
        </CardHeader>
    </Card>
);

export const DashboardHeader = ({
                                    loading,
                                    user,
                                    sprintOverviews,
                                    selectedSprintNumber,
                                    setSelectedSprintNumber,
                                    formatDate,
                                    greeting
                                }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const [currentGreeting, setCurrentGreeting] = React.useState('');

    React.useEffect(() => {
        setCurrentGreeting(greeting());
    }, [greeting]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSprintSelect = (sprintNumber) => {
        if (sprintNumber !== selectedSprintNumber) {
            setSelectedSprintNumber(sprintNumber);
        }
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {loading ? (
                <div className="w-full sm:w-64">
                    <SkeletonText lines={1} />
                </div>
            ) : (
                <h1 className="text-xl md:text-2xl font-bold truncate w-full sm:w-auto">
                    {currentGreeting}, <span className="text-oracleRed">{user ? `${user.firstName} ${user.lastName}` : 'Usuario'}</span>
                </h1>
            )}

            {loading ? (
                <div className="w-full sm:w-32">
                    <SkeletonText lines={1} />
                </div>
            ) : sprintOverviews && sprintOverviews.length > 0 && (
                <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 px-4 py-2 w-full sm:min-w-[150px] sm:w-auto justify-between"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                        }}
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                    >
                        <span className="truncate">Sprint {selectedSprintNumber || '?'}</span>
                        <FiChevronDown
                            size={16}
                            className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`}
                        />
                    </Button>

                    {isOpen && (
                        <div className="absolute right-0 left-0 sm:left-auto mt-2 bg-white border rounded-md shadow-lg z-10 w-full sm:min-w-[180px] sm:w-auto max-h-[300px] overflow-y-auto"
                             role="listbox">
                            {sprintOverviews
                                .sort((a, b) => b.sprintNumber - a.sprintNumber)
                                .map((sprint) => (
                                    <div
                                        key={sprint.sprintNumber}
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150 ${
                                            selectedSprintNumber === sprint.sprintNumber ? 'bg-gray-50 font-medium text-oracleRed' : ''
                                        }`}
                                        onClick={() => handleSprintSelect(sprint.sprintNumber)}
                                        role="option"
                                        aria-selected={selectedSprintNumber === sprint.sprintNumber}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">Sprint {sprint.sprintNumber}</span>
                                            <span className="text-sm text-gray-500">{formatDate(sprint.startDate)}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const SprintSummaryCard = ({ loading, selectedSprint, formatDate }) => (
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
                        <div className="text-gray-500 text-sm mb-1">Hours Spent</div>
                        <div className="text-2xl font-bold">{selectedSprint.totalRealHours}<span className="text-oracleRed">h</span></div>
                        <div className="text-xs text-gray-500">Time spent on finishing tasks</div>
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
);

export const SprintGoalCard = ({ loading, selectedSprint, calculateProgressArc }) => {
    const progressArc = calculateProgressArc ? calculateProgressArc() : {};
    const completionRateColor = progressArc.completionRateColor;

    return (
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
    );
};

export const TeamPerformanceCard = ({ loading, sprintUserData }) => (
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
                    {sprintUserData && sprintUserData.length > 0 ? (
                        sprintUserData.map((user, index) => (
                            <UserPerformanceItem key={index} user={user} />
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
);

export const UserPerformanceItem = ({ user }) => {
    const { FiCheckCircle, FiClock, FiActivity } = require('react-icons/fi');

    return (
        <div className="bg-gray-50 p-3 rounded-lg">
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
    );
};

export const DevStreakCard = ({ loading, selectedSprint }) => {
    const { BsFire } = require('react-icons/bs');

    return (
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
    );
};