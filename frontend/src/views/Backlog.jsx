import React, { useState } from 'react';
import { useBacklog } from '../hooks/useBacklog';
import { useSprints } from '../hooks/useSprints';
import { TaskCard, CreateTaskModal, TaskDetailModal, BacklogHeader, CreateSprintModal } from '../components/backlog/backlogComponents';
import { NoProjectState } from "../components/overview/overviewComponents";
import { Button } from '../lib/ui/Button';
import { SkeletonCard, SkeletonText } from '../lib/ui/Skeleton';
import { Search } from 'lucide-react';
import { useProjects } from "../hooks/useProjects";
import { Input } from "../lib/ui/Input";

const Backlog = () => {
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
    } = useBacklog();

    const {
        setCreateSprintModalOpen,
        createSprintModalOpen
    } = useSprints();

    const { selectedProject } = useProjects();

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const nonSprintTasks = backlogTasks.filter(task => task.sprint === null);

    const filteredTasks = searchTerm
        ? nonSprintTasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : nonSprintTasks;

    const priorityOrder = {
        4: 0, // Critical
        3: 1, // High
        2: 2, // Medium
        1: 3  // Low
    };

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

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
                loading={loading}
                onCreateTask={handleOpenCreateModal}
                onCreateSprint={handleOpenCreateSprintModal}
            />

            <div className="mb-6">
                {loading ? (
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

            {loading ? (
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
                            <Button
                                variant="default"
                                onClick={handleOpenCreateModal}
                            >
                                Create your first task
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {selectedTask && (
                <TaskDetailModal
                    isOpen={taskModalOpen}
                    onClose={handleCloseTaskModal}
                    task={selectedTask}
                    onUpdate={handleTaskUpdateWrap}
                    onDelete={handleTaskDeleteWrap}
                    loading={loading}
                    projectId={selectedProject?.id}
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
            />
        </div>
    );
};

export default Backlog;