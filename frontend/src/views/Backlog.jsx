import React, { useState } from 'react';
import { useBacklog } from '../hooks/useBacklog';
import {
    TaskList,
    TaskModal,
    CreateTaskModal,
    FilterPanel,
    SprintSelector,
    KanbanBoard
} from '../components/backlog/backlogComponents';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from '../lib/ui/Card';
import { Button } from '../lib/ui/Button';
import { Toggle } from '../lib/ui/Toggle';
import { Skeleton } from '../lib/ui/Skeleton';

const Backlog = () => {
    const {
        backlogTasks,
        sprintTasks,
        loading,
        error,
        selectedSprint,
        setSelectedSprint,
        selectedTask,
        setSelectedTask,
        taskModalOpen,
        setTaskModalOpen,
        handleTaskSelect,
        handleTaskCreate,
        handleTaskUpdate,
        handleTaskDelete,
        filterOptions,
        setFilterOptions,
        refreshBacklog
    } = useBacklog();

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
    const [availableSprints, setAvailableSprints] = useState([
        { id: 1, startDate: new Date('2025-03-01'), endDate: new Date('2025-03-15') },
        { id: 2, startDate: new Date('2025-03-16'), endDate: new Date('2025-03-31') }
    ]);

    // Determine which tasks to display based on sprint selection
    const displayTasks = selectedSprint ? sprintTasks : backlogTasks;

    const handleTaskSelectWrap = (taskId) => {
        handleTaskSelect(taskId);
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

    return (
        <div className="container mx-auto px-4 py-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">
                    {selectedSprint ? `Sprint ${selectedSprint} Tasks` : 'Backlog'}
                </h1>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button
                        variant="remarked"
                        onClick={() => setCreateModalOpen(true)}
                        className="w-full sm:w-auto"
                    >
                        Create Task
                    </Button>

                    <Toggle
                        label="Kanban View"
                        checked={viewMode === 'kanban'}
                        onChange={() => setViewMode(viewMode === 'list' ? 'kanban' : 'list')}
                    />
                </div>
            </div>

            <SprintSelector
                sprints={availableSprints}
                selectedSprint={selectedSprint}
                onChange={setSelectedSprint}
                loading={loading}
            />

            <FilterPanel
                filters={filterOptions}
                onChange={setFilterOptions}
            />

            {loading ? (
                <div className="mt-6">
                    <Skeleton className="h-10 w-full mb-4" />
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-4">
                                    <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-6">
                    {viewMode === 'list' ? (
                        <Card>
                            <CardHeader className="pb-0">
                                <CardTitle className="text-xl">
                                    {selectedSprint ? `Sprint ${selectedSprint} Tasks` : 'Backlog Tasks'}
                                    ({displayTasks.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <TaskList
                                    tasks={displayTasks}
                                    onTaskSelect={handleTaskSelectWrap}
                                    loading={loading}
                                />
                            </CardContent>
                        </Card>
                    ) : (
                        <KanbanBoard
                            tasks={displayTasks}
                            onTaskUpdate={handleTaskUpdate}
                            loading={loading}
                        />
                    )}
                </div>
            )}

            {selectedTask && (
                <TaskModal
                    isOpen={taskModalOpen}
                    onClose={handleCloseTaskModal}
                    task={selectedTask}
                    onUpdate={handleTaskUpdateWrap}
                    onDelete={handleTaskDeleteWrap}
                    loading={loading}
                />
            )}

            <CreateTaskModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={handleTaskCreate}
                projectId={1} // Replace with your actual project ID logic
                selectedSprint={selectedSprint}
            />
        </div>
    );
};

export default Backlog;