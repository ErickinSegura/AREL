//Backlog components
import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '../../lib/ui/Card';
import { Button } from '../../lib/ui/Button';
import { Input } from '../../lib/ui/Input';
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalContent,
    ModalFooter,
    ModalClose
} from '../../lib/ui/Modal';
import {
    Skeleton,
    SkeletonText,
    SkeletonCard
} from '../../lib/ui/Skeleton';

export const TaskCard = ({ task, onSelect, isDraggable = false }) => {
    const priorityColors = {
        1: 'bg-green-100 text-green-800',
        2: 'bg-blue-100 text-blue-800',
        3: 'bg-yellow-100 text-yellow-800',
        4: 'bg-red-100 text-red-800'
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

    const dragAttributes = isDraggable ? {
        draggable: true,
        onDragStart: (e) => {
            e.dataTransfer.setData('taskId', task.id);
        }
    } : {};

    return (
        <Card
            className="mb-3 hover:shadow-md transition-all cursor-pointer"
            onClick={() => onSelect(task.id)}
            {...dragAttributes}
        >
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{task.title}</h3>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                        {priorityLabels[task.priority]}
                    </div>
                </div>

                {task.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {stateLabels[task.state]}
          </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {categoryLabels[task.category]}
          </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {task.estimatedHours}h
          </span>
                    {task.assignedTo && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              ID: {task.assignedTo}
            </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export const TaskList = ({ tasks, onTaskSelect, loading }) => {
    if (loading) {
        return (
            <div>
                {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} lines={2} />
                ))}
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="p-8 text-center border-2 border-dashed rounded-lg">
                <p className="text-gray-500">No tasks found</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={onTaskSelect}
                    isDraggable
                />
            ))}
        </div>
    );
};

export const TaskModal = ({
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
        sprint: task?.sprint || null
    });

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
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Estimated Hours"
                                name="estimatedHours"
                                type="number"
                                value={formData.estimatedHours}
                                onChange={handleChange}
                            />

                            <div>
                                <label className="text-sm font-medium text-gray-700">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
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
                                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
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
                                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
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

                            <Input
                                label="Sprint"
                                name="sprint"
                                type="number"
                                value={formData.sprint || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="font-bold text-xl">{task.title}</h3>

                        {task.description && (
                            <p className="text-gray-700">{task.description}</p>
                        )}

                        <div className="grid grid-cols-2 gap-y-3">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Priority:</span>
                                <span className="ml-2">{priorityLabels[task.priority]}</span>
                            </div>

                            <div>
                                <span className="text-sm font-medium text-gray-600">State:</span>
                                <span className="ml-2">{stateLabels[task.state]}</span>
                            </div>

                            <div>
                                <span className="text-sm font-medium text-gray-600">Category:</span>
                                <span className="ml-2">{categoryLabels[task.category]}</span>
                            </div>

                            <div>
                                <span className="text-sm font-medium text-gray-600">Estimated Hours:</span>
                                <span className="ml-2">{task.estimatedHours}h</span>
                            </div>

                            {task.realHours && (
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Real Hours:</span>
                                    <span className="ml-2">{task.realHours}h</span>
                                </div>
                            )}

                            {task.assignedTo && (
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Assigned To:</span>
                                    <span className="ml-2">ID: {task.assignedTo}</span>
                                </div>
                            )}

                            <div>
                                <span className="text-sm font-medium text-gray-600">Sprint:</span>
                                <span className="ml-2">{task.sprint || 'Not assigned'}</span>
                            </div>

                            <div>
                                <span className="text-sm font-medium text-gray-600">Created:</span>
                                <span className="ml-2">{new Date(task.createdAt).toLocaleDateString()}</span>
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
                                    onClose,
                                    onCreate,
                                    projectId,
                                    selectedSprint
                                }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        estimatedHours: 1,
        projectId: projectId,
        type: 4,
        priority: 2,
        state: 1,
        assignedTo: '',
        category: 1,
        sprint: selectedSprint
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'estimatedHours' || name === 'priority' || name === 'state' || name === 'type' || name === 'category' || name === 'assignedTo'
                ? value === '' ? '' : Number(value)
                : value,
            projectId
        }));
    };

    const handleSubmit = async () => {
        const result = await onCreate({
            ...formData,
            assignedTo: formData.assignedTo === '' ? null : Number(formData.assignedTo),
            sprint: formData.sprint === '' ? null : Number(formData.sprint)
        });

        if (result) {
            setFormData({
                title: '',
                description: '',
                estimatedHours: 1,
                projectId: projectId,
                type: 4,
                priority: 2,
                state: 1,
                assignedTo: '',
                category: 1,
                sprint: selectedSprint
            });
            onClose();
        }
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

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader>
                <ModalTitle>Create New Task</ModalTitle>
                <ModalClose onClick={onClose} />
            </ModalHeader>
            <ModalContent>
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
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Estimated Hours"
                            name="estimatedHours"
                            type="number"
                            value={formData.estimatedHours}
                            onChange={handleChange}
                        />

                        <div>
                            <label className="text-sm font-medium text-gray-700">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
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
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
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
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
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
                            value={formData.assignedTo}
                            onChange={handleChange}
                        />

                        <Input
                            label="Sprint"
                            name="sprint"
                            type="number"
                            value={formData.sprint || ''}
                            onChange={handleChange}
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
                    disabled={!formData.title}
                >
                    Create Task
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export const FilterPanel = ({ filters, onChange }) => {
    const priorityOptions = {
        1: 'Low',
        2: 'Medium',
        3: 'High',
        4: 'Critical'
    };

    const stateOptions = {
        1: 'To Do',
        2: 'Doing',
        3: 'Done'
    };

    const categoryOptions = {
        1: 'Web',
        2: 'Bot'
    };

    const handleFilterChange = (name, value) => {
        onChange({
            ...filters,
            [name]: value === '' ? null : Number(value)
        });
    };

    const clearFilters = () => {
        onChange({
            type: null,
            priority: null,
            state: null,
            assignee: null,
            category: null
        });
    };

    return (
        <Card className="mb-6">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
                        <select
                            value={filters.priority || ''}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
                        >
                            <option value="">All</option>
                            {Object.entries(priorityOptions).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">State</label>
                        <select
                            value={filters.state || ''}
                            onChange={(e) => handleFilterChange('state', e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
                        >
                            <option value="">All</option>
                            {Object.entries(stateOptions).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                        <select
                            value={filters.category || ''}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
                        >
                            <option value="">All</option>
                            {Object.entries(categoryOptions).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Assignee ID</label>
                        <input
                            type="number"
                            value={filters.assignee || ''}
                            onChange={(e) => handleFilterChange('assignee', e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
                            placeholder="Any"
                        />
                    </div>

                    <div className="flex items-end">
                        <Button
                            onClick={clearFilters}
                            variant="default"
                            className="w-full"
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const SprintSelector = ({ sprints = [], selectedSprint, onChange, loading }) => {
    if (loading) {
        return <Skeleton className="h-10 w-full" />;
    }

    return (
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-grow w-full sm:w-auto">
                <select
                    value={selectedSprint || ''}
                    onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-oracleRed"
                >
                    <option value="">Backlog (No Sprint)</option>
                    {sprints.map((sprint) => (
                        <option key={sprint.id} value={sprint.id}>
                            Sprint {sprint.id} ({new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button
                    variant="default"
                    className="flex-grow sm:flex-grow-0"
                >
                    Create Sprint
                </Button>
            </div>
        </div>
    );
};

export const KanbanBoard = ({ tasks, onTaskUpdate, loading }) => {
    const states = {
        1: "To Do",
        2: "Doing",
        3: "Done"
    };

    const handleDrop = (e, targetState) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            const task = tasks.find(t => t.id === Number(taskId));
            if (task && task.state !== targetState) {
                onTaskUpdate(Number(taskId), { ...task, state: targetState });
            }
        }
    };

    const allowDrop = (e) => {
        e.preventDefault();
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="mb-4">
                            <Skeleton className="h-8 w-24" />
                        </div>
                        <div className="space-y-3">
                            <SkeletonCard lines={2} />
                            <SkeletonCard lines={2} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(states).map(([stateId, stateName]) => {
                const stateNum = Number(stateId);
                const stateTasks = tasks.filter(task => task.state === stateNum);

                return (
                    <div
                        key={stateId}
                        className="bg-gray-50 p-4 rounded-lg border min-h-64"
                        onDrop={(e) => handleDrop(e, stateNum)}
                        onDragOver={allowDrop}
                    >
                        <h3 className="font-medium text-lg mb-4 flex items-center justify-between">
                            {stateName}
                            <span className="bg-gray-200 text-gray-800 text-xs rounded-full px-2 py-1">
                {stateTasks.length}
              </span>
                        </h3>

                        <div className="space-y-3">
                            {stateTasks.map(task => (
                                <div key={task.id}
                                     draggable
                                     onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                                     className="bg-white p-3 rounded-lg shadow cursor-move hover:shadow-md transition-all"
                                >
                                    <h4 className="font-medium">{task.title}</h4>
                                    {task.description && (
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {task.estimatedHours}h
                    </span>
                                        {task.assignedTo && (
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        ID: {task.assignedTo}
                      </span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {stateTasks.length === 0 && (
                                <div className="p-4 text-center border-2 border-dashed rounded-lg text-gray-400">
                                    Drag tasks here
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};