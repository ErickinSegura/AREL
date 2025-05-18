import React, { useState } from 'react';
import { useBacklog } from '../hooks/useBacklog';
import { useSprints } from '../hooks/useSprints';
import { TaskCard, CreateTaskModal, TaskDetailModal, BacklogHeader, SortControls, CreateSprintModal } from '../components/backlog/backlogComponents';
import { NoProjectState } from "../components/overview/overviewComponents";
import { SkeletonCard, SkeletonText } from '../lib/ui/Skeleton';
import { Search } from 'lucide-react';
import { useProjects } from "../hooks/useProjects";
import { Input } from "../lib/ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { useProjectUsers } from "../hooks/useProjectUsers";


const Backlog = () => {
    const { user } = useAuth();
    const {
        backlogTasks,
        loading,
        error,
        selectedTask,
        setSelectedTask,
        taskModalOpen,
        setTaskModalOpen,
        handleTaskSelect,
        handleTaskCreate,
        handleTaskUpdate,
        handleTaskDelete,
        taskDetailLoading
    } = useBacklog();

    const {
        setCreateSprintModalOpen,
        createSprintModalOpen
    } = useSprints();

    const { selectedProject } = useProjects();

    const { users, usersLoading } = useProjectUsers(selectedProject?.id);

    const isLoading = loading || usersLoading;

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('priority'); // Estado para el tipo de ordenación

    const nonSprintTasks = backlogTasks.filter(task => task.sprint === null);

    const filteredTasks = searchTerm
        ? nonSprintTasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : nonSprintTasks;

    const sortTasks = (tasks) => {
        const sortedArray = [...tasks];

        switch(sortBy) {
            case 'priority-desc':
                const priorityOrderDesc = {
                    4: 0, // Critical
                    3: 1, // High
                    2: 2, // Medium
                    1: 3  // Low
                };
                return sortedArray.sort((a, b) => priorityOrderDesc[a.priority] - priorityOrderDesc[b.priority]);

            case 'priority-asc':
                const priorityOrderAsc = {
                    1: 0, // Low
                    2: 1, // Medium
                    3: 2, // High
                    4: 3  // Critical
                };
                return sortedArray.sort((a, b) => priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority]);


            case 'category':
                return sortedArray.sort((a, b) => {
                    const categoryA = a.category || '';
                    const categoryB = b.category || '';
                    return categoryA.localeCompare(categoryB);
                });

            case 'state':
                return sortedArray.sort((a, b) => {
                    const stateA = a.state || '';
                    const stateB = b.state || '';
                    return stateA.localeCompare(stateB);
                });

            default:
                return sortedArray;
        }
    };

    const sortedTasks = sortTasks(filteredTasks);

    const handleSortChange = (sortType) => {
        setSortBy(sortType);
    };

    const handleCloseTaskModal = () => {
        setTaskModalOpen(false);
        setSelectedTask(null);
    };

    const handleTaskUpdateWrap = async (taskId, taskData) => {
        const success = await handleTaskUpdate(taskId, taskData);
        if (success) {
            handleCloseTaskModal();
        }
    };

    const handleTaskDeleteWrap = async (taskId) => {
        const success = await handleTaskDelete(taskId);
        if (success) {
            handleCloseTaskModal();
        }
    };

    const handleOpenCreateModal = () => {
        setCreateModalOpen(true);
    };

    const handleOpenCreateSprintModal = () => {
        setCreateSprintModalOpen(true);
    };

    if (!selectedProject) {
        return (
            <NoProjectState title={"selected"} message={"Please select a project to view its backlog."} />
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                </div>
            )}

            <BacklogHeader
                selectedProject={selectedProject}
                loading={isLoading}
                onCreateTask={handleOpenCreateModal}
                onCreateSprint={handleOpenCreateSprintModal}
                isAdmin={user && (user.userLevel === 1 || user.userLevel === 3)}
            />

            <div className="mb-6">
                {isLoading ? (
                    <div className="space-y-4">
                        <SkeletonText lines={1} className="w-1/3 mb-2" />
                    </div>
                ) : (
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tasks..."
                        name="search"
                        leftIcon={<Search size={18} className="text-gray-400" />}
                    />
                )}
            </div>

            {!isLoading && (
                <SortControls
                    currentSort={sortBy}
                    onSortChange={handleSortChange}
                />
            )}

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <SkeletonCard key={i} lines={2} />
                    ))}
                </div>
            ) : (
                <div>
                    {sortedTasks.length > 0 ? (
                        <div className="space-y-4">
                            {sortedTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onSelect={handleTaskSelect}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                            <p className="text-gray-500 mb-4">No tasks in backlog</p>
                        </div>
                    )}
                </div>
            )}

            {(selectedTask || taskDetailLoading) && (
                <TaskDetailModal
                    isOpen={taskModalOpen}
                    onClose={handleCloseTaskModal}
                    task={selectedTask}
                    onUpdate={handleTaskUpdateWrap}
                    onDelete={handleTaskDeleteWrap}
                    loading={taskDetailLoading}
                    users={users}
                />
            )}

            <CreateTaskModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={handleTaskCreate}
                projectId={selectedProject.id}
            />

            <CreateSprintModal
                isOpen={createSprintModalOpen}
                onClose={() => setCreateSprintModalOpen(false)}
                projectId={selectedProject?.id}
                users={users}
            />
        </div>
    );
};

export default Backlog;