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
    const [progressStats, setProgressStats] = useState({
        completedTasks: 0,
        totalTasks: 0,
        percentImprovement: 0,
    });
    const [selectedUserPerformance, setSelectedUserPerformance] = useState(null);
    const [loadingUserPerformance, setLoadingUserPerformance] = useState(false);
    const [userPerformanceError, setUserPerformanceError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedProject) return;

            try {
                setLoading(true);

                const data = await OverviewService.getOverviewData(selectedProject.id);

                const processedSprintOverviews = (data.sprintOverviews || []).map(sprint => {
                    const completedTasks = sprint.completedTasks || 0;
                    const totalTasks = sprint.totalTasks || 0;
                    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                    return {
                        ...sprint,
                        completionRate
                    };
                });

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

        const currentCompletedTasks = currentSprint.completedTasks || 0;
        const currentTotalTasks = currentSprint.totalTasks || 0;
        const previousCompletedTasks = previousSprint.completedTasks || 0;
        const previousTotalTasks = previousSprint.totalTasks || 0;

        if (currentTotalTasks === 0 || previousTotalTasks === 0) return 0;

        const currentCompletionRate = currentCompletedTasks / currentTotalTasks;
        const previousCompletionRate = previousCompletedTasks / previousTotalTasks;

        if (previousCompletionRate === 0) return 0;

        return Math.round(((currentCompletionRate - previousCompletionRate) / previousCompletionRate) * 100);
    };

    const fetchUserPerformanceByID = async (userId) => {
        if (!selectedProject || !userId) return;

        try {
            setLoadingUserPerformance(true);
            setUserPerformanceError(null);

            const userPerformanceData = await OverviewService.getUserPerformanceByID(selectedProject.id, userId);

            const processedUserPerformance = {
                ...userPerformanceData,
                completionRate: userPerformanceData.assignedTasks > 0
                    ? (userPerformanceData.completedTasks / userPerformanceData.assignedTasks) * 100
                    : 0
            };

            setSelectedUserPerformance(processedUserPerformance);
            return processedUserPerformance;
        } catch (err) {
            console.error("Error fetching user performance data:", err);
            setUserPerformanceError("Failed to load user performance data.");
            return null;
        } finally {
            setLoadingUserPerformance(false);
        }
    };

    return {
        sprintOverviews,
        userPerformances,
        loading,
        error,
        currentSprint,
        progressStats,
        selectedUserPerformance,
        loadingUserPerformance,
        userPerformanceError,
        fetchUserPerformanceByID
    };
};