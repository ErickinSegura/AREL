import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../lib/ui/Card';
import { Button } from '../lib/ui/Button';
import {
    FiArrowUp,
    FiMoreHorizontal,
    FiFolder,
    FiCodesandbox
} from 'react-icons/fi';
import { useProjects } from '../hooks/useProjects';

const Overview = () => {
    const { selectedProject, loading } = useProjects();

    // Simulated data - in a real app, this would come from a hook or context
    const userData = {
        name: "Rocco",
        devStreak: 10,
        taskGoal: {
            completed: 12,
            total: 15,
            percentImprovement: 12.5
        }
    };

    // Calendar data
    const currentMonth = "February";
    const currentYear = "2025";

    // Days of the week
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // Calendar dates for February 2025
    const calendarDates = [
        { day: 26, month: "prev" },
        { day: 27, month: "prev" },
        { day: 28, month: "prev" },
        { day: 29, month: "prev" },
        { day: 30, month: "prev" },
        { day: 31, month: "prev" },
        { day: 1, month: "current" },
        { day: 2, month: "current" },
        { day: 3, month: "current" },
        { day: 4, month: "current" },
        { day: 5, month: "current" },
        { day: 6, month: "current" },
        { day: 7, month: "current" },
        { day: 8, month: "current" },
        { day: 9, month: "current" },
        { day: 10, month: "current" },
        { day: 11, month: "current" },
        { day: 12, month: "current" },
        { day: 13, month: "current" },
        { day: 14, month: "current" },
        { day: 15, month: "current" },
        { day: 16, month: "current" },
        { day: 17, month: "current" },
        { day: 18, month: "current" },
        { day: 19, month: "current" },
        { day: 20, month: "current" },
        { day: 21, month: "current" },
        { day: 22, month: "current" },
        { day: 23, month: "current" },
        { day: 24, month: "current" },
        { day: 25, month: "current" },
        { day: 26, month: "current" },
        { day: 27, month: "current", today: true },
        { day: 28, month: "current" },
        { day: 1, month: "next" }
    ];

    // Sprint tasks data
    const sprintTasks = [
        { id: "DEV-106", title: "Implement OAUTH2 authentication", status: "Doing", priority: "High" },
        { id: "DEV-105", title: "Integrate Stripe payment gateway", status: "To Do", priority: "High" },
        { id: "BUG-016", title: "Notification e-mails are sent twice", status: "Done", priority: "High" },
        { id: "QA-106", title: "Minor UI misalignment on mobile devices", status: "Doing", priority: "Low" },
        { id: "DEV-103", title: "Perform load testing on server", status: "To Do", priority: "High" }
    ];

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

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-64">
                <div className="animate-pulse text-gray-500">Cargando datos del proyecto...</div>
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
            {/* Project Header Card - Kept as requested */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center">
                        <CardTitle>
                            <div
                                className="w-12 h-12 rounded-md grid place-items-center text-white"
                                style={{ backgroundColor: selectedProject.color?.hexColor || '#808080' }}
                            >
                                {getProjectIcon(selectedProject.icon?.iconName)}
                            </div>
                            <h1 className="text-2xl font-bold">{selectedProject.projectName}</h1>
                        </CardTitle>
                    </div>
                </CardHeader>
            </Card>

            {/* Header with greeting */}
            <h1 className="text-2xl font-bold mb-6">
                Good Morning, <span className="text-red-500">{userData.name}</span>
            </h1>

            {/* Top row cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Dev Streak Card */}
                <Card className="flex flex-col items-center justify-center py-6">
                    <CardHeader>
                        <CardTitle className="text-center">Dev Streak</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center pt-4">
                        <div className="text-orange-500 mb-2">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M32 12C32 12 35.6 20 40 24C44.4 28 52 32 52 32C52 32 44.4 36 40 40C35.6 44 32 52 32 52C32 52 28.4 44 24 40C19.6 36 12 32 12 32C12 32 19.6 28 24 24C28.4 20 32 12 32 12Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-orange-500 text-4xl font-bold">{userData.devStreak}</span>
                            <span className="text-2xl ml-2">Days</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">You are in the top 10 dev streak rank!</p>
                    </CardContent>
                </Card>

                {/* Goal Progress Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your <span className="text-red-500">Goal</span></CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="relative w-40 h-40 mb-4">
                            {/* Circular progress indicator */}
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="transparent"
                                    stroke="#f0f0f0"
                                    strokeWidth="10"
                                />
                                {/* Progress arc - teal segment */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="transparent"
                                    stroke="#10B981"
                                    strokeWidth="10"
                                    strokeDasharray="282.6"
                                    strokeDashoffset="240"
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                />
                                {/* Progress arc - orange segment */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="transparent"
                                    stroke="#FF5722"
                                    strokeWidth="10"
                                    strokeDasharray="282.6"
                                    strokeDashoffset="200"
                                    strokeLinecap="round"
                                    transform="rotate(-40 50 50)"
                                />
                            </svg>
                            {/* Center text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold">{userData.taskGoal.completed}/{userData.taskGoal.total}</span>
                                <span className="text-xs text-gray-500">TASKS COMPLETED</span>
                            </div>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                            <FiArrowUp className="text-red-500 mr-1" />
                            <span>Performing {userData.taskGoal.percentImprovement}% better than last sprint!</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom row cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Calendar Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {currentMonth} {currentYear}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Days of week header */}
                        <div className="grid grid-cols-7 mb-2">
                            {daysOfWeek.map((day, index) => (
                                <div key={index} className="text-center text-sm font-medium">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDates.map((date, index) => {
                                const isToday = date.today;
                                const isCurrentMonth = date.month === "current";

                                return (
                                    <div
                                        key={index}
                                        className={`
                      text-center py-2 text-sm rounded-md
                      ${isToday ? 'bg-red-500 text-white' : ''}
                      ${!isCurrentMonth ? 'text-gray-400' : ''}
                    `}
                                    >
                                        {date.day}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Sprint Tasks Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            This <span className="text-red-500">Sprint</span> Tasks
                        </CardTitle>
                        <Button size="small" className="text-sm">SEE ALL</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {sprintTasks.map(task => (
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
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Overview;