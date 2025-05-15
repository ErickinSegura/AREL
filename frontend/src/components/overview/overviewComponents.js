import React, {useMemo, useState} from 'react';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../lib/ui/Card';
import { Button } from '../../lib/ui/Button';
import {
    FiFolder,
    FiCodesandbox,
    FiChevronDown,
    FiAlertTriangle,
    FiArrowUp, FiActivity, FiClock, FiCheckCircle, FiUser
} from 'react-icons/fi';
import { Skeleton, SkeletonText, SkeletonCircle } from '../../lib/ui/Skeleton';
import { AICall, PDF } from '../../lib/ui/PDF/PDF';
import { pdf } from '@react-pdf/renderer';
import { OverviewService } from '../../api/overviewService';
import {useAuth} from "../../contexts/AuthContext";
import {useDeveloperCharts} from "../../hooks/useDeveloperCharts";
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {UserCircle} from "lucide-react";
import {Task} from "@mui/icons-material";

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

export const PDFButton = ({ selectedProject }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth()

    const userRole = user?.userLevel || 2;
    const shouldShowButton = userRole === 1 || userRole === 3;

    if (!shouldShowButton) {
        return null;
    }

    const handleGenerateAndDownloadPdf = async () => {
        setLoading(true);
        try {
            // Show a loading message to the user
            console.log("Fetching project data...");

            // Get all the data we need for the PDF
            const overviewData = await OverviewService.getOverviewData(selectedProject.id);

            // Transform the sprint data for the PDF
            const projectData = transformOverviewDataToProjectFormat(overviewData);

            // Extract user performance data
            const userPerformances = overviewData.userPerformances || [];

            console.log("Generating AI insights...");

            // Get AI-generated insights
            const aiResponse = await AICall(projectData);

            console.log("Creating PDF...");

            // Generate the PDF with all the data
            const pdfBlob = await pdf(
                <PDF
                    insightsHtml={aiResponse}
                    projectData={projectData}
                    userPerformances={userPerformances}
                />
            ).toBlob();

            console.log("Downloading PDF...");

            // Create a download link for the PDF
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${selectedProject?.projectName || 'project'}_report.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log("PDF downloaded successfully!");

        } catch (error) {
            console.error("Error generating or downloading PDF:", error);
            alert("There was an error generating the PDF. Please try again later.");
        }
        setLoading(false);
    };

    const transformOverviewDataToProjectFormat = (overviewData) => {
        if (overviewData.sprintOverviews && overviewData.sprintOverviews.length > 0) {
            return overviewData.sprintOverviews.map(sprint => ({
                sprintNumber: sprint.sprintNumber,
                totalTasks: sprint.totalTasks,
                completedTasks: sprint.completedTasks,
                totalEstimatedHours: sprint.totalEstimatedHours,
                totalRealHours: sprint.totalRealHours,
                hoursSpentOnCompleted: sprint.hoursSpentOnCompleted || 0
            }));
        }
        console.error("Data structure is not as expected:", overviewData);
        return [];
    };

    return (
        <div className="flex items-center mt-4">
            <Button
                variant="remarked"
                color="error"
                onClick={handleGenerateAndDownloadPdf}
                disabled={loading || !selectedProject}
            >
                {loading ? 'Generating PDF...' : 'Save as PDF'}
            </Button>
        </div>
    );
};

export const ProjectHeader = ({ selectedProject, loading, isAdmin = false }) => (
    <Card className="mb-4 sm:mb-6">
        <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${loading ? 'animate-pulse' : ''}`}>
                <CardTitle className="w-full sm:w-auto">
                    {loading ? (
                        <div className="flex items-center">
                            <SkeletonCircle size="md" />
                            <div className="ml-3 w-32 sm:w-48">
                                <SkeletonText lines={1} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center w-full">
                            <div
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl grid place-items-center text-white flex-shrink-0"
                                style={{ backgroundColor: selectedProject?.color?.hexColor || '#808080' }}
                            >
                                {getProjectIcon(selectedProject?.icon)}
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold sm:px-3 ml-3 sm:ml-0 break-words max-w-full truncate">
                                {selectedProject?.projectName}
                            </h1>
                        </div>
                    )}
                </CardTitle>

                {!loading && isAdmin && (
                    <div className="mt-2 sm:mt-0">
                        <PDFButton
                            selectedProject={selectedProject}
                        />
                    </div>
                )}
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
                        <div className="text-xs text-gray-500">vs {selectedSprint.totalEstimatedHours}h estimated</div>
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

export const LogsCard = ({ loading, logs}) => {
    const [mounted, setMounted] = useState(false);
    console.log("loading logs", loading)

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>
                    {loading ? (
                        <SkeletonText className="w-40" />
                    ) : (
                        <>Project <span className="text-oracleRed">Logs</span></>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto max-h-96">
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
                            </div>
                        ))}
                    </div>
                ) : logs && logs.length > 0 && mounted ? (
                    <div className="space-y-3">
                        {logs.map((log, index) => (
                            <FadeIn delay={100 + index * 150} key={log.id}>
                                <LogItem log={log} formatDate={formatDate}/>
                            </FadeIn>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        No logs available for this sprint
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: enUS });
}

const LogItem = ({ log }) => {
    const formattedDate = formatDate(log.timeOfLog);
    const actionText = getActionLog(log.actionLog);

    return (
        <div className="bg-white p-3 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center">
                <div className="font-medium text-oracleRed">{actionText}</div>
                <div className="text-sm text-gray-500">{formattedDate}</div>
            </div>
            <div className="text-sm text-gray-600 flex flex-wrap gap-x-4">
                {log.title && (
                    <div className="flex items-center">
                        <FiCheckCircle className="mr-1 shrink-0" size={16} />
                        <span>{log.title}</span>
                    </div>
                )}
                {!(log.firstname === "Sistema") && (
                    <div className="flex items-center">
                        <FiUser className="mr-1 shrink-0" size={16} />
                        <span>{log.firstname}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

const getActionLog = (action) => {
    switch (action) {
        case 1:
            return 'A task was set as done';
        case 2:
            return 'A task was set as doing';
        case 3:
            return 'A task was created';
        case 4:
            return 'A sprint was created';
        default:
            return 'Unknown action';
    }
}

const FadeIn = ({ children, delay = 0, duration = 300 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
            }}
        >
            {children}
        </div>
    );
};

const AnimatedArc = ({ progressArc, completionRateColor }) => {
    const [animatedOffset, setAnimatedOffset] = useState(progressArc.strokeDasharray);

    // Resetear y animar el offset cuando cambia el sprint seleccionado
    useEffect(() => {
        // Primero reseteamos al valor máximo (sin progreso)
        setAnimatedOffset(progressArc.strokeDasharray);

        // Luego animamos hasta el offset calculado
        const timer = setTimeout(() => {
            setAnimatedOffset(progressArc.strokeDashoffset);
        }, 50);

        return () => clearTimeout(timer);
    }, [progressArc.strokeDashoffset, progressArc.strokeDasharray]);

    return (
        <svg className="w-full h-full" viewBox="0 0 100 50">
            {/* Arco de fondo (gris) */}
            <path
                d="M5,45 A45,45 0 0,1 95,45"
                fill="transparent"
                stroke="#f0f0f0"
                strokeWidth="10"
                strokeLinecap="round"
            />
            {/* Arco de progreso (coloreado según completitud) */}
            <path
                d="M5,45 A45,45 0 0,1 95,45"
                fill="transparent"
                stroke={completionRateColor}
                strokeWidth="10"
                strokeDasharray={progressArc.strokeDasharray}
                strokeDashoffset={animatedOffset}
                strokeLinecap="round"
                style={{
                    transition: 'stroke-dashoffset 0.8s ease-in-out'
                }}
            />
        </svg>
    );
};

const AnimatedProgressBar = ({ percentage, color }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // Animación desde 0 hasta el porcentaje final
        setTimeout(() => {
            setWidth(percentage);
        }, 300);
    }, [percentage]);

    return (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
                className={`h-2 rounded-full ${color}`}
                style={{
                    width: `${width}%`,
                    transition: 'width 1s ease-out'
                }}
            />
        </div>
    );
};

const AnimatedCounter = ({ end, duration = 1000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(updateCount);
            }
        };

        animationFrame = requestAnimationFrame(updateCount);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [end, duration]);

    return <>{count}</>;
};

export const SprintGoalCard = ({ loading, selectedSprint, calculateProgressArc }) => {
    const [resetKey, setResetKey] = useState(0);
    const progressArc = calculateProgressArc ? calculateProgressArc() : {};
    const completionRateColor = progressArc.completionRateColor;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (selectedSprint) {
            setResetKey(prevKey => prevKey + 1);
        }
    }, [selectedSprint?.id]);

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
                ) : selectedSprint && mounted && (
                    <>
                        <FadeIn delay={100}>
                            <div className="relative w-60 h-36 mb-4">
                                <AnimatedArc
                                    key={resetKey}
                                    progressArc={progressArc}
                                    completionRateColor={completionRateColor}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
                                    <span className="text-3xl font-bold">
                                        <AnimatedCounter
                                            key={resetKey}
                                            end={selectedSprint.completedTasks}
                                            duration={1200}
                                        />
                                        /{selectedSprint.totalTasks}
                                    </span>
                                    <span className="text-xs text-gray-500">TASKS COMPLETED</span>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={600}>
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
                        </FadeIn>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export const TeamPerformanceCard = ({ loading, sprintUserData }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
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
                            sprintUserData
                                .sort((a, b) => a.userName.localeCompare(b.userName))
                                .map((user, index) => (
                                <FadeIn delay={100 + index * 150} key={index}>
                                    <UserPerformanceItem user={user} />
                                </FadeIn>
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
};

export const UserPerformanceItem = ({ user }) => {
    return (
        <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between mb-2">
                <div className="font-medium">{user.userName}</div>
                <div className={`text-sm font-semibold ${
                    user.completionRate >= 75 ? 'text-green-500' :
                        user.completionRate >= 50 ? 'text-yellow-500' :
                            'text-red-500'
                }`}>
                    <AnimatedCounter end={Math.round(user.completionRate)} />% Completion
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center justify-center">
                    <FiCheckCircle className="mr-1 text-blue-500" />
                    <span>
            <AnimatedCounter end={user.completedTasks} duration={800} />
            /{user.assignedTasks} Tasks
          </span>
                </div>
                <div className="flex items-center justify-center">
                    <FiClock className="mr-1 text-purple-500" />
                    <span>
            <AnimatedCounter end={user.totalEstimatedHours} duration={800} />h Estimated
          </span>
                </div>
                <div className="flex items-center justify-center">
                    <FiActivity className="mr-1 text-orange-500" />
                    <span>
            <AnimatedCounter end={user.totalRealHours} duration={800} />h Spent
          </span>
                </div>
            </div>
            <AnimatedProgressBar
                percentage={user.completionRate}
                color={
                    user.completionRate >= 75 ? 'bg-green-500' :
                        user.completionRate >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                }
            />
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

const RoundedBar = ({ x, y, width, height, fill, animationDelay = 0 }) => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), animationDelay);
        return () => clearTimeout(timer);
    }, [animationDelay]);

    const radius = Math.min(8, width / 2);
    const animatedHeight = animated ? height : 0;
    const animatedY = animated ? y : y + height;

    return (
        <g>
            <path
                d={`
          M ${x},${animatedY + animatedHeight}
          L ${x},${animatedY + radius}
          Q ${x},${animatedY} ${x + radius},${animatedY}
          L ${x + width - radius},${animatedY}
          Q ${x + width},${animatedY} ${x + width},${animatedY + radius}
          L ${x + width},${animatedY + animatedHeight}
          Z
        `}
                fill={fill}
                style={{
                    transition: "d 0.5s ease-out",
                }}
            />
        </g>
    );
};

const SimpleBarChart = ({
                            data,
                            keys,
                            colors,
                            width = "100%",
                            height = 320,
                            margin = { top: 20, right: 30, left: 60, bottom: 60 },
                            xLabel = "",
                            yLabel = "",
                            tooltipFormatter = (value) => value,
                            dataKeyNames = {},
                        }) => {
    const chartRef = useState(() => React.createRef())[0];
    const [chartDimensions, setChartDimensions] = useState({ width: 600, height: 320 });
    const [tooltipData, setTooltipData] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        setMounted(true);

        const updateDimensions = () => {
            if (chartRef.current) {
                const { width, height } = chartRef.current.getBoundingClientRect();
                setChartDimensions({ width, height });
                setIsPortrait(window.innerWidth < 768);
            }
        };

        const timer = setTimeout(() => {
            if (!data || data.length === 0) {
                setShowNoDataMessage(true);
            }
        }, 500);

        updateDimensions();
        window.addEventListener("resize", updateDimensions);

        return () => {
            window.removeEventListener("resize", updateDimensions);
            clearTimeout(timer);
        };
    }, [data, chartRef]);

    if (showNoDataMessage) {
        return (
            <div
                ref={chartRef}
                style={{
                    width,
                    height,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed #ccc",
                    borderRadius: "8px",
                    color: "#666"
                }}
            >
                No data available
            </div>
        );
    }

    if (!mounted || !data || data.length === 0) {
        return (
            <div
                ref={chartRef}
                style={{
                    width,
                    height,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <div className="animate-pulse flex space-x-4">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    const responsiveMargin = {
        top: margin.top,
        right: isPortrait ? 15 : margin.right,
        left: isPortrait ? 40 : margin.left,
        bottom: isPortrait ? 100 : margin.bottom,
    };

    const chartWidth = chartDimensions.width - responsiveMargin.left - responsiveMargin.right;
    const chartHeight = chartDimensions.height - responsiveMargin.top - responsiveMargin.bottom;

    const barCategories = data.map((d) => d.name);
    const barCount = barCategories.length;
    const maxVisibleBars = isPortrait ? 6 : 12;
    const compactMode = barCount > maxVisibleBars;

    const barWidth = Math.max(
        8,
        Math.min(90, (chartWidth / barCount) * 0.7)
    );
    const groupPadding = Math.max(2, (chartWidth / barCount) * 0.3);

    const maxValue = Math.max(
        ...data.flatMap((d) => keys.map((key) => d[key] || 0)),
        0.1
    );

    const yScale = (value) => chartHeight - (value / maxValue) * chartHeight;

    const getXPosition = (index) =>
        responsiveMargin.left + index * (chartWidth / barCount) + groupPadding / 2;

    const bars = [];
    data.forEach((d, i) => {
        const x = getXPosition(i);

        keys.forEach((key, keyIndex) => {
            const value = d[key] || 0;
            const barX = x + (keyIndex * (barWidth / keys.length));
            const barHeight = chartHeight - yScale(value);

            bars.push(
                <RoundedBar
                    key={`bar-${i}-${key}`}
                    x={barX}
                    y={responsiveMargin.top + chartHeight - barHeight}
                    width={barWidth / keys.length}
                    height={barHeight}
                    fill={colors[key]}
                    animationDelay={i * 50 + keyIndex * 20}
                />
            );
        });
    });

    const xAxisTicks = barCategories.map((category, i) => {
        if (compactMode && i % Math.ceil(barCount / maxVisibleBars) !== 0 && i !== barCount - 1) {
            return null;
        }

        const x = getXPosition(i) + barWidth / 2;
        return (
            <g key={`x-tick-${i}`}>
                <line
                    x1={x}
                    y1={responsiveMargin.top + chartHeight}
                    x2={x}
                    y2={responsiveMargin.top + chartHeight + 5}
                    stroke="#666"
                />
                <text
                    x={x}
                    y={responsiveMargin.top + chartHeight + (isPortrait ? 10 : 20)}
                    textAnchor={isPortrait ? "end" : "middle"}
                    fontSize="10"
                    transform={isPortrait ? `rotate(-45, ${x}, ${responsiveMargin.top + chartHeight + 10})` : undefined}
                    style={{ maxWidth: "50px", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                    {category.length > 10 && isPortrait ? `${category.substring(0, 10)}...` : category}
                </text>
            </g>
        );
    });

    // Determinar ticks del eje Y de forma dinámica
    const yTicks = isPortrait ? 3 : 5;
    const yAxisTicks = Array.from({ length: yTicks }).map((_, i) => {
        const value = maxValue * (1 - i / (yTicks - 1));
        const y = responsiveMargin.top + yScale(value);
        return (
            <g key={`y-tick-${i}`}>
                <line
                    x1={responsiveMargin.left - 5}
                    y1={y}
                    x2={responsiveMargin.left}
                    y2={y}
                    stroke="#666"
                />
                <text
                    x={responsiveMargin.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize={isPortrait ? "9" : "11"}
                >
                    {Math.round(value)}
                </text>
                <line
                    x1={responsiveMargin.left}
                    y1={y}
                    x2={responsiveMargin.left + chartWidth}
                    y2={y}
                    stroke="#ddd"
                    strokeDasharray="3,3"
                />
            </g>
        );
    });

    // Ajustar leyenda para ser responsiva
    const legendItems = keys.map((key, i) => {
        const itemsPerRow = isPortrait ? 2 : keys.length;
        const rowIndex = Math.floor(i / itemsPerRow);
        const colIndex = i % itemsPerRow;

        return (
            <g
                key={`legend-${i}`}
                transform={`translate(${responsiveMargin.left + (colIndex * (chartWidth / itemsPerRow))}, ${
                    chartDimensions.height - 20 - (rowIndex * 20)
                })`}
            >
                <rect width="10" height="10" fill={colors[key]} rx="2" />
                <text x="15" y="8" fontSize={isPortrait ? "10" : "12"}>
                    {dataKeyNames[key] || key}
                </text>
            </g>
        );
    });

    // Manejo de eventos para el tooltip mejorado
    const handleMouseMove = (e) => {
        const svgRect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;

        const barIndex = Math.floor((mouseX - responsiveMargin.left) / (chartWidth / barCount));
        if (barIndex >= 0 && barIndex < data.length) {
            const item = data[barIndex];
            const x = getXPosition(barIndex) + barWidth / 2;
            setTooltipData({
                item,
                x,
                y: responsiveMargin.top,
                mouseX,
                mouseY
            });
        }
    };

    const handleTouchStart = (e) => {
        if (e.touches && e.touches[0]) {
            // Para eventos táctiles, necesitamos manejar las coordenadas de manera diferente
            const svgElement = e.currentTarget || e.target; // Usar e.target como fallback
            const svgRect = svgElement.getBoundingClientRect();
            const touchX = e.touches[0].clientX - svgRect.left;
            const touchY = e.touches[0].clientY - svgRect.top;

            const barIndex = Math.floor((touchX - responsiveMargin.left) / (chartWidth / barCount));
            if (barIndex >= 0 && barIndex < data.length) {
                const item = data[barIndex];
                const x = getXPosition(barIndex) + barWidth / 2;
                setTooltipData({
                    item,
                    x,
                    y: responsiveMargin.top,
                    mouseX: touchX,
                    mouseY: touchY
                });
            }
        }
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    // Crear tooltip responsivo y accesible
    const tooltip = tooltipData && (
        <div
            role="tooltip"
            aria-live="polite"
            style={{
                position: "absolute",
                left: Math.min(
                    tooltipData.mouseX + 10,
                    chartDimensions.width - 150
                ),
                top: Math.min(
                    tooltipData.mouseY - 50,
                    chartDimensions.height - 100
                ),
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "8px",
                pointerEvents: "none",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                fontSize: "12px",
                zIndex: 10,
                minWidth: "120px",
                maxWidth: isPortrait ? "150px" : "200px"
            }}
        >
            <div className="font-bold mb-1">{tooltipData.item.name}</div>
            {keys.map((key) => (
                <div key={key} className="flex items-center mt-1">
          <span
              className="inline-block w-3 h-3 mr-2 rounded-sm"
              style={{ backgroundColor: colors[key] }}
          ></span>
                    <span>
            {dataKeyNames[key] || key}: {tooltipFormatter(tooltipData.item[key] || 0, key)}
          </span>
                </div>
            ))}
        </div>
    );

    return (
        <div
            ref={chartRef}
            style={{ width, height, position: "relative" }}
            className="font-sans text-gray-800"
        >
            <svg
                width="100%"
                height="100%"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchStart}
                onTouchEnd={handleMouseLeave}
                role="img"
                aria-label={`Gráfico de barras: ${xLabel} vs ${yLabel}`}
            >
                {/* Ejes X e Y */}
                <line
                    x1={responsiveMargin.left}
                    y1={responsiveMargin.top + chartHeight}
                    x2={responsiveMargin.left + chartWidth}
                    y2={responsiveMargin.top + chartHeight}
                    stroke="#666"
                />
                <line
                    x1={responsiveMargin.left}
                    y1={responsiveMargin.top}
                    x2={responsiveMargin.left}
                    y2={responsiveMargin.top + chartHeight}
                    stroke="#666"
                />

                <text
                    transform={`translate(${isPortrait ? 12 : 15}, ${
                        responsiveMargin.top + chartHeight / 2
                    }) rotate(-90)`}
                    textAnchor="middle"
                    fontSize={isPortrait ? "10" : "12"}
                    fontWeight="bold"
                >
                    {yLabel}
                </text>

                {/* Líneas de cuadrícula y marcas */}
                {yAxisTicks}
                {xAxisTicks}

                {/* Barras animadas */}
                {bars}

                {/* Leyenda responsiva */}
                {legendItems}
            </svg>

            {/* Tooltip mejorado */}
            {tooltip}
        </div>
    );
};

export const SprintHoursChart = React.memo(({ loading, sprintOverviews }) => {
    const chartData = useMemo(() => {
        if (!sprintOverviews || sprintOverviews.length === 0) return [];

        return [...sprintOverviews]
            .filter(sprint => sprint.totalEstimatedHours > 0 || sprint.totalRealHours > 0)
            .sort((a, b) => a.sprintNumber - b.sprintNumber)
            .map(sprint => ({
                name: `Sprint ${sprint.sprintNumber}`,
                estimated: sprint.totalEstimatedHours || 0,
                actual: sprint.totalRealHours || 0
            }));
    }, [sprintOverviews]);

    const chartElement = useMemo(() => {
        if (loading) {
            return (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-full">
                        <SkeletonText className="h-48 w-full" />
                    </div>
                </div>
            );
        }

        if (!chartData.length) {
            return (
                <div className="h-64 flex items-center justify-center text-gray-500">
                    No sprint data available
                </div>
            );
        }

        return (
            <SimpleBarChart
                data={chartData}
                keys={['estimated', 'actual']}
                colors={{ estimated: '#EA6447', actual: '#C74634' }}
                xLabel="Sprints"
                yLabel="Hours"
                dataKeyNames={{ estimated: 'Estimated Hours', actual: 'Actual Hours' }}
                tooltipFormatter={(value) => `${value} hours`}
                height={320}
            />
        );
    }, [loading, chartData]);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>
                    {loading ? (
                        <SkeletonText className="w-40" />
                    ) : (
                        <>Hours <span className="text-oracleRed">Analysis</span></>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                {chartElement}
            </CardContent>
        </Card>
    );
});

export const DeveloperHoursChart = React.memo(({ userPerformances, loading }) => {
    const { chartData, developers, colors } = useDeveloperCharts(userPerformances, loading);

    const chartElement = useMemo(() => {
        if (loading) {
            return (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-full">
                        <SkeletonText className="h-48 w-full" />
                    </div>
                </div>
            );
        }

        if (!chartData.hours.length) {
            return (
                <div className="h-64 flex items-center justify-center text-gray-500">
                    No data available
                </div>
            );
        }


        const dataKeyNames = {};
        developers.forEach(dev => {
            dataKeyNames[dev] = dev;
        });
        developers.sort((a, b) => a.localeCompare(b));


        return (
            <SimpleBarChart
                data={chartData.hours}
                keys={developers}
                colors={colors}
                xLabel="Sprints"
                yLabel="Hours Worked"
                dataKeyNames={dataKeyNames}
                tooltipFormatter={(value, name) => `${value} hours`}
                height={320}
            />
        );
    }, [loading, chartData.hours, developers, colors]);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>
                    {loading ? (
                        <SkeletonText className="w-40" />
                    ) : (
                        <>Hours <span className="text-oracleRed">Worked</span></>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                {chartElement}
            </CardContent>
        </Card>
    );
});

export const DeveloperTasksChart = React.memo(({ userPerformances, loading }) => {
    // Use your existing useDeveloperCharts hook here
    const { chartData, developers, colors } = useDeveloperCharts(userPerformances, loading);

    const chartElement = useMemo(() => {
        if (loading) {
            return (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-full">
                        <SkeletonText className="h-48 w-full" />
                    </div>
                </div>
            );
        }

        if (!chartData.tasks.length) {
            return (
                <div className="h-64 flex items-center justify-center text-gray-500">
                    No data available
                </div>
            );
        }

        const dataKeyNames = {};
        developers.forEach(dev => {
            dataKeyNames[dev] = dev;
        });
        developers.sort((a, b) => a.localeCompare(b));

        return (
            <SimpleBarChart
                data={chartData.tasks}
                keys={developers}
                colors={colors}
                xLabel="Sprints"
                yLabel="Tasks Completed"
                dataKeyNames={dataKeyNames}
                tooltipFormatter={(value, name) => `${value} tasks`}
                height={320}
            />
        );
    }, [loading, chartData.tasks, developers, colors]);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>
                    {loading ? (
                        <SkeletonText className="w-40" />
                    ) : (
                        <>Tasks <span className="text-oracleRed">Complete</span></>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                {chartElement}
            </CardContent>
        </Card>
    );
});