import React, {useState} from "react";
import {useProjects} from "../hooks/useProjects";
import {HTML5Backend} from 'react-dnd-html5-backend';
import {useBacklog} from '../hooks/useBacklog';
import {useSprints} from '../hooks/useSprints';
import {TaskDetailModal} from '../components/backlog/backlogComponents';
import {NoProjectState} from "../components/overview/overviewComponents";
import {DndProvider} from 'react-dnd';
import {SkeletonCard, SkeletonText} from '../lib/ui/Skeleton';
import {
    ActualHoursModal,
    SprintSelector,
    SprintsHeader,
    TaskColumn
} from '../components/sprintManagement/sprintManagementComponents';
import {FiCheckCircle, FiClock, FiList} from "react-icons/fi";
import {useProjectUsers} from "../hooks/useProjectUsers";

const SprintManagement = () => {
    const {
        sprintTasks,
        loading,
        error,
        selectedTask,
        setSelectedTask,
        taskModalOpen,
        setTaskModalOpen,
        handleTaskSelect,
        handleTaskUpdate,
        selectedSprint,
        setSelectedSprint,
        taskDetailLoading
    } = useBacklog();

    const { sprints, loading: sprintsLoading } = useSprints();
    const { selectedProject } = useProjects();
    const { users, usersLoading } = useProjectUsers(selectedProject?.id);
    const [actualHoursModalOpen, setActualHoursModalOpen] = useState(false);
    const [taskForHours, setTaskForHours] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    const todoTasks = sprintTasks.filter(task => task.state === 1);
    const doingTasks = sprintTasks.filter(task => task.state === 2);
    const doneTasks = sprintTasks.filter(task => task.state === 3);

    const handleCloseTaskModal = () => {
        setTaskModalOpen(false);
        setSelectedTask(null);
    };

    const handleTaskDrop = async (taskId, newState) => {
        const taskToUpdate = sprintTasks.find(task => task.id === taskId);

        if (taskToUpdate && taskToUpdate.state !== newState) {
            if (newState === 3 && !taskToUpdate.realHours) {
                setTaskForHours(taskId);
                setActualHoursModalOpen(true);
                return;
            }

            try {
                setUpdateLoading(true);
                await handleTaskUpdate(taskId, { state: newState });
            } catch (error) {
                console.error("Error updating task state:", error);
            } finally {
                setUpdateLoading(false);
            }
        }
    };

    const handleActualHoursSubmit = async (taskId, data) => {
        try {
            setUpdateLoading(true);
            return await handleTaskUpdate(taskId, {
                state: 3,
                realHours: data.realHours
            });
        } catch (error) {
            console.error("Error updating task hours:", error);
            return false;
        } finally {
            setUpdateLoading(false);
        }
    };

    if (!selectedProject) {
        return <NoProjectState title={"selected"} message={"Please select a project to view its sprints."} />;
    }
    

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mx-auto px-4 py-6 min-h-screen">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <SprintsHeader
                    selectedProject={selectedProject}
                    loading={loading}
                    onCreateTask={() => {}}
                    onCreateSprint={() => {}}
                    selector = {
                        <SprintSelector
                            sprints={sprints || []}
                            selectedSprint={selectedSprint}
                            onSprintChange={setSelectedSprint}
                            loading={sprintsLoading}
                        />
                    }
                />

                {selectedSprint ? (
                    loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-4">
                                    <SkeletonText lines={1} className="w-24 mb-2" />
                                    <SkeletonCard lines={2} />
                                    <SkeletonCard lines={2} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 h-[calc(100vh-240px)]">
                            <TaskColumn
                                icon={<FiList/>}
                                title="To Do"
                                state={1}
                                tasks={todoTasks}
                                onTaskSelect={handleTaskSelect}
                                onTaskDrop={handleTaskDrop}
                                users={users}
                                usersLoading={usersLoading}
                            />
                            <TaskColumn
                                icon={<FiClock/>}
                                title="Doing"
                                state={2}
                                tasks={doingTasks}
                                onTaskSelect={handleTaskSelect}
                                onTaskDrop={handleTaskDrop}
                                users={users}
                                usersLoading={usersLoading}
                            />
                            <TaskColumn
                                icon={<FiCheckCircle/>}
                                title="Done"
                                state={3}
                                tasks={doneTasks}
                                onTaskSelect={handleTaskSelect}
                                onTaskDrop={handleTaskDrop}
                                users={users}
                                usersLoading={usersLoading}
                            />
                        </div>
                    )
                ) : (
                    !loading && (
                        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                            <p className="text-gray-500 mb-4">Please select a sprint to manage tasks</p>
                        </div>
                    )
                )}

                {(selectedTask || taskDetailLoading) && (
                    <TaskDetailModal
                        isOpen={taskModalOpen}
                        onClose={handleCloseTaskModal}
                        task={selectedTask}
                        onUpdate={handleTaskUpdate}
                        onDelete={() => {}}
                        loading={taskDetailLoading}
                        users={users}
                    />
                )}

                <ActualHoursModal
                    isOpen={actualHoursModalOpen}
                    onClose={() => setActualHoursModalOpen(false)}
                    taskId={taskForHours}
                    onSubmit={handleActualHoursSubmit}
                    loading={updateLoading}
                />
            </div>
        </DndProvider>
    );
};

export default SprintManagement;