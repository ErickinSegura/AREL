import { useState, useEffect } from 'react';
import { OverviewService } from '../api/overviewService';
import { useProjects } from './useProjects';

export const useOverviewData = () => {
    const { selectedProject } = useProjects();
    const [sprintOverviews, setSprintOverviews] = useState([]);
    const [userPerformances, setUserPerformances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSprint, setCurrentSprint] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [progressStats, setProgressStats] = useState({
        completedTasks: 0,
        totalTasks: 0,
        percentImprovement: 0
    });
    const [devStreak, setDevStreak] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedProject) return;

            try {
                setLoading(true);

                const data = await OverviewService.getOverviewData(selectedProject.id);

                setSprintOverviews(data.sprintOverviews || []);
                setUserPerformances(data.userPerformances || []);

                if (data.sprintOverviews && data.sprintOverviews.length > 0) {
                    const sortedSprints = [...data.sprintOverviews].sort((a, b) => b.sprintNumber - a.sprintNumber);
                    const latestSprint = sortedSprints[0];
                    setCurrentSprint(latestSprint);

                    setProgressStats({
                        completedTasks: latestSprint.completedTasks,
                        totalTasks: latestSprint.totalTasks,
                        percentImprovement: calculateImprovement(sortedSprints)
                    });

                    const streak = calculateDevStreak(sortedSprints);
                    setDevStreak(streak);
                }

                if (data.userPerformances && data.userPerformances.length > 0) {
                    setTasks(generateTasksFromPerformance(data.userPerformances));
                }

            } catch (err) {
                console.error("Error fetching overview data:", err);
                setError("Failed to load project overview data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedProject]);

    const calculateImprovement = (sortedSprints) => {
        if (sortedSprints.length < 2) return 0;

        const currentSprint = sortedSprints[0];
        const previousSprint = sortedSprints[1];

        const currentCompletionRate = currentSprint.completedTasks / currentSprint.totalTasks;
        const previousCompletionRate = previousSprint.completedTasks / previousSprint.totalTasks;

        if (previousCompletionRate === 0) return 0;

        return Math.round(((currentCompletionRate - previousCompletionRate) / previousCompletionRate) * 100);
    };

    const calculateDevStreak = (sortedSprints) => {
        let streak = 0;

        for (const sprint of sortedSprints) {
            const completionRate = sprint.totalTasks > 0
                ? (sprint.completedTasks / sprint.totalTasks) * 100
                : 0;

            if (completionRate >= 75) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    const generateTasksFromPerformance = (performances) => {
        const currentSprintPerfs = performances.filter(
            perf => currentSprint && perf.sprintNumber === currentSprint.sprintNumber
        );

        const tasks = [];
        let taskId = 1;

        currentSprintPerfs.forEach(perf => {
            // Create completed tasks
            for (let i = 0; i < Math.min(perf.completedTasks, 2); i++) {
                tasks.push({
                    id: `DEV-${100 + taskId++}`,
                    title: `Task for ${perf.userName}`,
                    status: "Done",
                    priority: Math.random() > 0.5 ? "High" : "Low",
                    assignee: perf.userName
                });
            }

            // Create in-progress tasks
            const inProgressTasks = Math.min(2, perf.assignedTasks - perf.completedTasks);
            for (let i = 0; i < inProgressTasks; i++) {
                tasks.push({
                    id: `DEV-${100 + taskId++}`,
                    title: `In-progress task for ${perf.userName}`,
                    status: "Doing",
                    priority: Math.random() > 0.5 ? "High" : "Low",
                    assignee: perf.userName
                });
            }

            // Create to-do tasks
            const todoTasks = Math.min(1, perf.assignedTasks - perf.completedTasks - inProgressTasks);
            for (let i = 0; i < todoTasks; i++) {
                tasks.push({
                    id: `DEV-${100 + taskId++}`,
                    title: `Todo task for ${perf.userName}`,
                    status: "To Do",
                    priority: Math.random() > 0.5 ? "High" : "Low",
                    assignee: perf.userName
                });
            }
        });

        return tasks.slice(0, 5);
    };

    return {
        sprintOverviews,
        userPerformances,
        loading,
        error,
        currentSprint,
        tasks,
        progressStats,
        devStreak
    };
};