import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '../../lib/ui/Card';
import {Clock, Tag, User, CalendarDays, AlertTriangle, Calendar, Loader2, Inbox, CheckCircle, CheckSquare, Circle, AlertCircle, Save, FileText, AlignLeft, Flag} from 'lucide-react';
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalContent,
    ModalFooter,
    ModalClose
} from '../../lib/ui/Modal';
import { Button } from '../../lib/ui/Button';
import { Input } from '../../lib/ui/Input';
import {SkeletonCircle, SkeletonText} from '../../lib/ui/Skeleton';
import {FiCodesandbox, FiFolder} from "react-icons/fi";
import {useBacklog} from "../../hooks/useBacklog";
import { useSprints } from '../../hooks/useSprints';
import { useProjectUsers } from '../../hooks/useProjectUsers';

const priorityColors = {
    1: 'bg-green-100 text-green-800 border-green-200',
    2: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    3: 'bg-red-100 text-red-800 border-red-200',
    4: 'bg-purple-100 text-purple-800 border-purple-200'
};

const priorityLabels = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Critical'
};

const stateLabels = {
    1: 'To Do',
    2: 'Doing',
    3: 'Done'
};

const categoryLabels = {
    1: 'Web',
    2: 'Bot'
};

const stateColors = {
    1: 'bg-gray-100 text-gray-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-green-100 text-green-800'
};

const getProjectIcon = (iconID) => {
    switch (iconID) {
        case 1: return <FiFolder />;
        case 2: return <FiCodesandbox />;
        default: return <FiCodesandbox />;
    }
};

export const BacklogHeader = ({ selectedProject, loading, onCreateTask, onCreateSprint }) => (
    <Card className="mb-6">
        <CardHeader>
            <div className={`flex items-center justify-between ${loading ? 'animate-pulse' : ''}`}>
                <CardTitle>
                    {loading ? (
                        <div className="flex items-center">
                            <SkeletonCircle size="md" />
                            <div className="ml-3 w-48">
                                <SkeletonText lines={1} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <div
                                className="w-12 h-12 rounded-md grid place-items-center text-white"
                                style={{ backgroundColor: selectedProject?.color?.hexColor || '#808080' }}
                            >
                                {getProjectIcon(selectedProject?.icon)}
                            </div>
                            <h1 className="text-2xl font-bold px-2">Project Backlog</h1>
                        </div>
                    )}
                </CardTitle>

                {!loading && (
                    <div className="flex space-x-2">
                        <Button
                            variant="default"
                            onClick={onCreateSprint}
                        >
                            Create Sprint
                        </Button>
                        <Button
                            variant="remarked"
                            onClick={onCreateTask}
                        >
                            Add Task
                        </Button>
                    </div>
                )}
            </div>
        </CardHeader>
    </Card>
);

export const TaskCard = ({ task, onSelect }) => {
    return (
        <Card
            className="hover:shadow-md transition-all cursor-pointer"
            onClick={() => onSelect(task.id)}
        >
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start my-3">
                            <h3 className="font-medium text-lg">{task.title}</h3>
                            <div className={`text-xs font-medium px-2 py-1 rounded-full w-20 ${priorityColors[task.priority]} border flex justify-center items-center`}>
                                {priorityLabels[task.priority]}
                            </div>

                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${stateColors[task.state]}`}>
                        {stateLabels[task.state]}
                    </div>

                    <div className="inline-flex items-center text-xs text-gray-600">
                        <Tag size={14} className="mr-1" />
                        {categoryLabels[task.category]}
                    </div>

                    <div className="inline-flex items-center text-xs text-gray-600">
                        <Clock size={14} className="mr-1" />
                        {task.estimatedHours}h
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const TaskDetailModal = ({
                                    isOpen,
                                    onClose,
                                    task,
                                    onUpdate,
                                    onDelete,
                                    loading,
                                    projectId
                                }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        estimatedHours: task?.estimatedHours || 0,
        type: task?.type || 4,
        priority: task?.priority || 2,
        state: task?.state || 1,
        assignedTo: task?.assignedTo || '',
        category: task?.category || 1,
        sprint: null
    });

    const { users, usersLoading } = useProjectUsers(projectId);

    // Actualizar formData cuando la tarea cambie
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                estimatedHours: task.estimatedHours || 0,
                type: task.type || 4,
                priority: task.priority || 2,
                state: task.state || 1,
                assignedTo: task.assignedTo || '',
                category: task.category || 1,
                sprint: task.sprint || null
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'estimatedHours' || name === 'priority' || name === 'state' || name === 'type' || name === 'category' || name === 'assignedTo'
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = () => {
        onUpdate(task.id, formData);
        setEditMode(false);
    };

    const renderAssignedUserContent = () => {
        if (!task.assignedTo) return "Unassigned";

        if (usersLoading) {
            return <SkeletonText lines={1} className="w-24" />;
        }

        const assignedUser = users.find(u => u.id === task.assignedTo);
        if (assignedUser) {
            return `${assignedUser.firstName} ${assignedUser.lastName}`;
        }

        return "Usuario no encontrado";
    };

    if (loading || !task) {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalHeader>
                    <ModalTitle>Task Details</ModalTitle>
                    <ModalClose onClick={onClose} />
                </ModalHeader>
                <ModalContent>
                    <SkeletonText lines={5} />
                </ModalContent>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader>
                <ModalTitle>{editMode ? 'Edit Task' : 'Task Details'}</ModalTitle>
                <ModalClose onClick={onClose} />
            </ModalHeader>
            <ModalContent>
                {editMode ? (
                    <div className="space-y-4">
                        <Input
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full"
                        />

                        <div>
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Estimated Hours"
                                name="estimatedHours"
                                type="number"
                                min="0"
                                value={formData.estimatedHours}
                                onChange={handleChange}
                            />

                            <div>
                                <label className="text-sm font-medium text-gray-700">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Object.entries(priorityLabels).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">State</label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Object.entries(stateLabels).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Object.entries(categoryLabels).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Assigned To</label>
                                {usersLoading ? (
                                    <div className="mt-1 w-full px-4 py-2 border rounded-md bg-gray-50">
                                        <SkeletonText lines={1} />
                                    </div>
                                ) : (
                                    <select
                                        name="assignedTo"
                                        value={formData.assignedTo || ''}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.firstName} {user.lastName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-xl">{task.title}</h3>
                            <div className={`text-xs font-medium px-2 py-1 rounded-full w-20 ${priorityColors[task.priority]} border flex justify-center items-center`}>
                                {priorityLabels[task.priority]}
                            </div>
                        </div>

                        {task.description ? (
                            <p className="text-gray-700 border-b pb-4">{task.description}</p>
                        ) : (
                            <p className="text-gray-400 italic border-b pb-4">No description</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                            <div className="flex items-center">
                                <Tag size={18} className="text-gray-500 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Category</p>
                                    <p>{categoryLabels[task.category]}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <AlertTriangle size={18} className="text-gray-500 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Status</p>
                                    <p>{stateLabels[task.state]}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Clock size={18} className="text-gray-500 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Estimated Hours</p>
                                    <p>{task.estimatedHours}h</p>
                                </div>
                            </div>

                            {task.realHours && (
                                <div className="flex items-center">
                                    <Clock size={18} className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Real Hours</p>
                                        <p>{task.realHours}h</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center">
                                <User size={18} className="text-gray-500 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Assigned To</p>
                                    <div>{renderAssignedUserContent()}</div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <CalendarDays size={18} className="text-gray-500 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Created</p>
                                    <p>{new Date(task.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </ModalContent>
            <ModalFooter>
                {editMode ? (
                    <>
                        <Button onClick={() => setEditMode(false)} variant="default">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="remarked">
                            Save Changes
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            onClick={() => onDelete(task.id)}
                            variant="danger"
                        >
                            Delete
                        </Button>
                        <Button onClick={() => setEditMode(true)} variant="default">
                            Edit
                        </Button>
                    </>
                )}
            </ModalFooter>
        </Modal>
    );
};

export const CreateTaskModal = ({
                                    isOpen,
                                    onClose
                                }) => {
    const {
        taskFormData,
        handleTaskFormChange,
        handleTaskCreate,
        validationError,
        loading,
        resetTaskForm
    } = useBacklog();

    useEffect(() => {
        if (!isOpen) {
            resetTaskForm();
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        const result = await handleTaskCreate();
        if (result) {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-2xl w-full mx-auto max-h-screen flex flex-col"
        >
            <ModalHeader className="sticky top-0 z-10 px-4 sm:px-6">
                <ModalTitle className="text-xl font-semibold">Create New Task</ModalTitle>
                <ModalClose onClick={onClose} className="absolute right-4 top-3" />
            </ModalHeader>

            <ModalContent className="overflow-y-auto max-h-[calc(100vh-18rem)]">
                <div className="space-y-6">
                    {validationError && (
                        <div className="text-red-500 text-sm flex items-center p-3 bg-red-50 rounded-md">
                            <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    {/* Task Details Section */}
                    <div className="p-4">
                        <h3 className="text-lg font-medium mb-1 flex items-center">
                            <FileText size={18} className="text-gray-500 mr-2" />
                            Task Details
                        </h3>

                        <div className="space-y-4 mt-3">
                            <Input
                                label="Title"
                                name="title"
                                value={taskFormData.title}
                                onChange={handleTaskFormChange}
                                className="w-full"
                                required
                            />

                            <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <AlignLeft size={14} className="mr-2" />
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={taskFormData.description}
                                    onChange={handleTaskFormChange}
                                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <Flag size={14} className="mr-2" />
                                        Priority
                                    </label>
                                    <select
                                        name="priority"
                                        value={taskFormData.priority}
                                        onChange={handleTaskFormChange}
                                        className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.entries(priorityLabels).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <Tag size={14} className="mr-2" />
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={taskFormData.category}
                                        onChange={handleTaskFormChange}
                                        className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.entries(categoryLabels).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalContent>

            <ModalFooter className="px-4 sm:px-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full sm:w-auto"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="remarked"
                    disabled={!taskFormData.title || loading}
                    className="w-full sm:w-auto"
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <Save size={16} className="mr-2" />
                            Create Task
                        </>
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export const CreateSprintModal = ({ isOpen, onClose }) => {
    const {
        sprintFormData,
        handleSprintFormChange,
        selectedTasks,
        availableTasks,
        toggleTaskSelection,
        updateTaskDetails,
        handleCreateSprint,
        validationError,
        loading,
        resetSprintForm,
        projectId
    } = useSprints();

    const { filteredUsers } = useProjectUsers(projectId);

    const [hoursWarnings, setHoursWarnings] = useState({});

    useEffect(() => {
        if (!isOpen) {
            resetSprintForm();
            setHoursWarnings({});
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        const success = await handleCreateSprint();
        if (success) {
            onClose();
        }
    };

    const priorityLabels = {
        1: 'Low',
        2: 'Medium',
        3: 'High',
        4: 'Critical'
    };

    const priorityColors = {
        1: 'bg-green-100 text-green-800 border-green-200',
        2: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        3: 'bg-red-100 text-red-800 border-red-200',
        4: 'bg-purple-100 text-purple-800 border-purple-200'
    };

    const isTaskSelected = (taskId) => {
        return selectedTasks.some(task => task.id === taskId);
    };

    const handleHoursChange = (taskId, value) => {
        const numValue = parseFloat(value);

        updateTaskDetails(taskId, 'estimatedHours', value);

        if (numValue > 4) {
            setHoursWarnings(prev => ({
                ...prev,
                [taskId]: true
            }));
        } else {
            setHoursWarnings(prev => {
                const newWarnings = {...prev};
                delete newWarnings[taskId];
                return newWarnings;
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-3xl w-full mx-auto max-h-screen flex flex-col"
        >

        <ModalHeader className="sticky top-0 z-10 px-4 sm:px-6">
                <ModalTitle className="text-xl font-semibold">Create New Sprint</ModalTitle>
                <ModalClose onClick={onClose} className="absolute right-4 top-3" />
            </ModalHeader>

            <ModalContent className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-18rem)]">
            <div className="space-y-6">
                    {validationError && (
                        <div className="text-red-500 text-sm flex items-center p-3 bg-red-50 rounded-md">
                            <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    {/* Sprint Details Section */}
                    <div className="p-4">
                        <h3 className="text-lg font-medium mb-1 flex items-center">Sprint Details</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="col-span-1 sm:col-span-2 mt-2">
                                <div className="flex items-center mb-2">
                                    <Calendar size={18} className="text-gray-500 mr-2" />
                                    <span className="text-gray-700 font-medium">Sprint Duration</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Start Date"
                                        name="startDate"
                                        type="date"
                                        value={sprintFormData.startDate}
                                        onChange={handleSprintFormChange}
                                        required
                                    />

                                    <Input
                                        label="End Date"
                                        name="endDate"
                                        type="date"
                                        value={sprintFormData.endDate}
                                        onChange={handleSprintFormChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Available Tasks Section */}
                    <div className="mt-6 p-4">
                        <h3 className="text-lg font-medium mb-1 flex items-center">
                            Available Tasks
                            <span className="ml-2 text-sm text-gray-500 font-normal">
                                ({availableTasks.length})
                            </span>
                        </h3>

                        <div className="max-h-64 overflow-y-auto rounded-md border">
                            {availableTasks.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                                    <Inbox size={40} className="mb-2 text-gray-400" />
                                    <p>No available tasks in backlog</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {availableTasks.map(task => (
                                        <Card
                                            key={task.id}
                                            className={`border-0 rounded-none cursor-pointer p-3 transition-colors duration-150 ${
                                                isTaskSelected(task.id)
                                                    ? 'ring-2 ring-oracleRed bg-gray-50'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => toggleTaskSelection(task.id)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <span className="mr-2">
                                                        {isTaskSelected(task.id) ?
                                                            <CheckCircle size={16} className="text-oracleRed" /> :
                                                            <Circle size={16} className="text-gray-300" />
                                                        }
                                                    </span>
                                                    <span className="font-medium truncate max-w-xs">{task.title}</span>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]} border flex-shrink-0`}>
                                                    {priorityLabels[task.priority]}
                                                </span>
                                            </div>
                                            {task.description && (
                                                <p className="text-sm text-gray-600 mt-1 truncate pl-6">{task.description}</p>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Tasks Section */}
                    {selectedTasks.length > 0 && (
                        <div className="mt-6 p-4">
                            <h3 className="text-lg font-medium mb-3 flex items-center">
                                <CheckSquare size={18} className="mr-2 text-green-600" />
                                Selected Tasks
                                <span className="ml-2 text-sm text-gray-500 font-normal">
                                    ({selectedTasks.length})
                                </span>
                            </h3>

                            <div className="space-y-4">
                                {selectedTasks.map(task => (
                                    <Card key={task.id} className="p-4 bg-gray-50 border-gray-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-medium text-oracleRed">{task.title}</span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-gray-700 flex items-center">
                                                    <Clock size={14} className="mr-1" />
                                                    Estimated Hours
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        className={`mt-1 w-full px-3 py-2 border ${hoursWarnings[task.id] ? 'border-orange-300 bg-orange-50' : 'border-gray-300'} rounded-md text-sm`}
                                                        value={task.estimatedHours || ''}
                                                        onChange={(e) => handleHoursChange(task.id, e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    {hoursWarnings[task.id] && (
                                                        <div className="mt-1 text-orange-600 text-xs flex items-center">
                                                            <AlertCircle size={12} className="mr-1" />
                                                            Consider breaking this task down (over 4 hours)
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-medium text-gray-700 flex items-center">
                                                    <User size={14} className="mr-1" />
                                                    Assigned To (ID)
                                                </label>
                                                <select
                                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                    value={task.assignedTo || ''}
                                                    onChange={(e) => updateTaskDetails(
                                                        task.id,
                                                        'assignedTo',
                                                        e.target.value === '' ? null : Number(e.target.value)
                                                    )}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {filteredUsers.map(user => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.firstName} {user.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </ModalContent>

            <ModalFooter className="px-4 sm:px-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full sm:w-auto"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="remarked"
                    disabled={selectedTasks.length === 0 || loading}
                    className="w-full sm:w-auto"
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <Save size={16} className="mr-2" />
                            Create Sprint
                        </>
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};