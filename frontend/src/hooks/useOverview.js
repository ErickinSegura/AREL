import { useState, useEffect } from 'react';
import { useProjects } from './useProjects';
import { useOverviewData } from './useOverviewData';
import { useAuth } from '../contexts/AuthContext';

export const useOverview = () => {
    const { selectedProject, loading: projectLoading, projectsLoading } = useProjects();
    const {
        sprintOverviews,
        userPerformances,
        loading: dataLoading,
        error,
        currentSprint: latestSprint,
        selectedUserPerformance,
        loadingUserPerformance,
        userPerformanceError,
        fetchUserPerformanceByID
    } = useOverviewData();

    const { user } = useAuth();

    const [selectedSprintNumber, setSelectedSprintNumber] = useState(null);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [sprintUserData, setSprintUserData] = useState([]);
    const [showSprintDropdown, setShowSprintDropdown] = useState(false);
    const [currentUserPerformance, setCurrentUserPerformance] = useState(null);

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

            if (user) {
                const userPerf = filteredUsers.find(
                    perf => perf.userName === `${user.firstName} ${user.lastName}`
                );
                setCurrentUserPerformance(userPerf || null);
            }
        }
    }, [selectedSprintNumber, userPerformances, user]);

    useEffect(() => {
        if (selectedProject && user && selectedSprintNumber) {
            fetchUserPerformanceByID(user.id).then(data => {
                if (data) {
                    const sprintData = data.find(perf => perf.sprintNumber === selectedSprintNumber);
                    if (sprintData) {
                        setCurrentUserPerformance(sprintData);
                    }
                }
            });
        }
    }, [selectedProject, user, selectedSprintNumber, fetchUserPerformanceByID]);

    const loading = projectLoading || dataLoading || projectsLoading || loadingUserPerformance;

    const getProjectIcon = (iconName) => {
        switch (iconName) {
            case 'folder': return 'folder';
            case 'codesandbox': return 'codesandbox';
            default: return 'codesandbox';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getCompletionRateColor = (completionRate) => {
        if (completionRate >= 75) return "#10B981"; // green
        if (completionRate >= 50) return "#FBBF24"; // yellow
        return "#EF4444"; // red
    };

    const calculateProgressArc = (userPerf = null) => {
        const perfData = userPerf || selectedSprint;
        if (!perfData) return { strokeDasharray: 0, strokeDashoffset: 0 };

        const total = perfData.totalTasks || perfData.assignedTasks || 1;
        const completed = perfData.completedTasks || 0;
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

    const toggleSprintDropdown = () => setShowSprintDropdown(!showSprintDropdown);
    const closeSprintDropdown = () => setShowSprintDropdown(false);

    return {
        user,
        selectedProject,
        loading,
        error,
        sprintOverviews,
        selectedSprint,
        selectedSprintNumber,
        sprintUserData,
        showSprintDropdown,
        setSelectedSprintNumber,
        formatDate,
        getProjectIcon,
        getCompletionRateColor,
        calculateProgressArc,
        toggleSprintDropdown,
        closeSprintDropdown,
        currentUserPerformance,
        loadingUserPerformance,
        userPerformanceError,
        fetchUserPerformanceByID
    };
};