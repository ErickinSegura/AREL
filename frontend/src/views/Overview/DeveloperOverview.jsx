import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../lib/ui/Card';
import { Button } from '../../lib/ui/Button';
import {
    FiFolder,
    FiCodesandbox,
    FiChevronDown
} from 'react-icons/fi';
import { useProjects } from '../../hooks/useProjects';
import { useOverviewData } from '../../hooks/useOverviewData';
import { SkeletonText, SkeletonCircle } from '../../lib/ui/Skeleton';
import { useAuth } from "../../contexts/AuthContext";
import { greeting } from '../../lib/greetings';

const DeveloperOverview = () => {
    const { selectedProject, loading: projectLoading } = useProjects();
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


    const loading = projectLoading || dataLoading;

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
        </div>
    );
};

export default DeveloperOverview;