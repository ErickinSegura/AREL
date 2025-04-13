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
        percentImprovement: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedProject) return;

            try {
                setLoading(true);

                const data = await OverviewService.getOverviewData(selectedProject.id);

                // Calculate completion rate for each sprint and add it to the sprint data
                const processedSprintOverviews = (data.sprintOverviews || []).map(sprint => {
                    const completedTasks = sprint.completedTasks || 0;
                    const totalTasks = sprint.totalTasks || 0;
                    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                    return {
                        ...sprint,
                        completionRate
                    };
                });

                // Calculate completion rate for each user performance and add it to the user data
                const processedUserPerformances = (data.userPerformances || []).map(user => {
                    const completedTasks = user.completedTasks || 0;
                    const assignedTasks = user.assignedTasks || 0;
                    const completionRate = assignedTasks > 0 ? (completedTasks / assignedTasks) * 100 : 0;

                    return {
                        ...user,
                        completionRate
                    };
                });

                setSprintOverviews(processedSprintOverviews);
                setUserPerformances(processedUserPerformances);

                if (processedSprintOverviews.length > 0) {
                    const sortedSprints = [...processedSprintOverviews].sort((a, b) => b.sprintNumber - a.sprintNumber);
                    const latestSprint = sortedSprints[0];
                    setCurrentSprint(latestSprint);

                    setProgressStats({
                        completedTasks: latestSprint.completedTasks || 0,
                        totalTasks: latestSprint.totalTasks || 0,
                        percentImprovement: calculateImprovement(sortedSprints),
                    });
                }

                if (processedUserPerformances.length > 0) {
                    setTasks(generateTasksFromPerformance(processedUserPerformances));
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

        // Verificamos que existen los valores antes de usarlos
        const currentCompletedTasks = currentSprint.completedTasks || 0;
        const currentTotalTasks = currentSprint.totalTasks || 0;
        const previousCompletedTasks = previousSprint.completedTasks || 0;
        const previousTotalTasks = previousSprint.totalTasks || 0;

        // Evitamos división por cero
        if (currentTotalTasks === 0 || previousTotalTasks === 0) return 0;

        const currentCompletionRate = currentCompletedTasks / currentTotalTasks;
        const previousCompletionRate = previousCompletedTasks / previousTotalTasks;

        if (previousCompletionRate === 0) return 0;

        return Math.round(((currentCompletionRate - previousCompletionRate) / previousCompletionRate) * 100);
    };

    const generateTasksFromPerformance = (performances) => {
        const currentSprintPerfs = performances.filter(
            perf => currentSprint && perf.sprintNumber === currentSprint.sprintNumber
        );

        const tasks = [];
        let taskId = 1;

        currentSprintPerfs.forEach(perf => {
            const completedTasks = perf.completedTasks || 0;
            const assignedTasks = perf.assignedTasks || 0;
            const userName = perf.userName || 'Unknown User';

            for (let i = 0; i < Math.min(completedTasks, 2); i++) {
                tasks.push({
                    id: `DEV-${100 + taskId++}`,
                    title: `Task for ${userName}`,
                    status: "Done",
                    priority: Math.random() > 0.5 ? "High" : "Low",
                    assignee: userName
                });
            }

            const inProgressTasks = Math.min(2, assignedTasks - completedTasks);
            for (let i = 0; i < inProgressTasks; i++) {
                tasks.push({
                    id: `DEV-${100 + taskId++}`,
                    title: `In-progress task for ${userName}`,
                    status: "Doing",
                    priority: Math.random() > 0.5 ? "High" : "Low",
                    assignee: userName
                });
            }

            const todoTasks = Math.min(1, assignedTasks - completedTasks - inProgressTasks);
            for (let i = 0; i < todoTasks; i++) {
                tasks.push({
                    id: `DEV-${100 + taskId++}`,
                    title: `Todo task for ${userName}`,
                    status: "To Do",
                    priority: Math.random() > 0.5 ? "High" : "Low",
                    assignee: userName
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
    };
};