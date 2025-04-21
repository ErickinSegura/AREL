import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '../../lib/ui/Card';
import { Clock, Tag, User, CalendarDays, AlertTriangle } from 'lucide-react';
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
                            <div className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[task.priority]} border`}>
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

                    {task.assignedTo && (
                        <div className="inline-flex items-center text-xs text-gray-600">
                            <User size={14} className="mr-1" />
                            ID: {task.assignedTo}
                        </div>
                    )}
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
                                    loading
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

    const getUserName = (userId) => {
        if (!userId) return "Unassigned";
        return `User ${userId}`;
    };

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

                            <Input
                                label="Assigned To (ID)"
                                name="assignedTo"
                                type="number"
                                value={formData.assignedTo || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-xl">{task.title}</h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                                {priorityLabels[task.priority]}
                            </span>
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
                                    <p>{getUserName(task.assignedTo)}</p>
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
    }, [isOpen, resetTaskForm]);

    const handleSubmit = async () => {
        const result = await handleTaskCreate();
        if (result) {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader>
                <ModalTitle>Create New Task</ModalTitle>
                <ModalClose onClick={onClose} />
            </ModalHeader>
            <ModalContent>
                <div className="space-y-4">
                    {validationError && (
                        <div className="text-red-500 text-sm">{validationError}</div>
                    )}

                    <Input
                        label="Title"
                        name="title"
                        value={taskFormData.title}
                        onChange={handleTaskFormChange}
                        className="w-full"
                        required
                    />

                    <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={taskFormData.description}
                            onChange={handleTaskFormChange}
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
                            value={taskFormData.estimatedHours}
                            onChange={handleTaskFormChange}
                        />

                        <div>
                            <label className="text-sm font-medium text-gray-700">Priority</label>
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
                            <label className="text-sm font-medium text-gray-700">State</label>
                            <select
                                name="state"
                                value={taskFormData.state}
                                onChange={handleTaskFormChange}
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
                                value={taskFormData.category}
                                onChange={handleTaskFormChange}
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {Object.entries(categoryLabels).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="Assigned To (ID)"
                            name="assignedTo"
                            type="number"
                            value={taskFormData.assignedTo || ''}
                            onChange={handleTaskFormChange}
                            placeholder="Leave empty if not assigned"
                        />
                    </div>
                </div>
            </ModalContent>
            <ModalFooter>
                <Button onClick={onClose} variant="default">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="remarked"
                    disabled={!taskFormData.title || loading}
                >
                    {loading ? 'Creating...' : 'Create Task'}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
