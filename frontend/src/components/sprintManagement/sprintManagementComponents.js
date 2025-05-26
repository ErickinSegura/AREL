import React, {useEffect, useState, useRef} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {Card, CardContent} from '../../lib/ui/Card';
import { Button } from '../../lib/ui/Button';
import { Input } from '../../lib/ui/Input';
import {SkeletonText} from '../../lib/ui/Skeleton';
import {Clock, Tag, CheckCircle, ArrowDownCircle, Loader2, User,} from 'lucide-react';
import { FiChevronDown } from 'react-icons/fi';
import { format } from 'date-fns';
import {useCategory} from "../../hooks/useCategory";


import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalContent,
    ModalFooter,
    ModalClose
} from '../../lib/ui/Modal';
import {AvatarRenderer} from "../../lib/AvatarRenderer";

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


export const ActualHoursModal = ({ isOpen, onClose, taskId, onSubmit, loading }) => {
    const [actualHours, setActualHours] = useState('');

    const handleSubmit = async () => {
        if (!actualHours) return;

        const success = await onSubmit(taskId, {
            realHours: Number(actualHours)
        });

        if (success) {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader>
                <ModalTitle>Set Actual Hours</ModalTitle>
                <ModalClose onClick={onClose} />
            </ModalHeader>
            <ModalContent>
                <div className="space-y-4">
                    <p className="text-gray-600">Please enter the actual hours spent on this task:</p>
                    <Input
                        label="Actual Hours"
                        type="number"
                        min="0"
                        step="1"
                        value={actualHours}
                        onChange={(e) => setActualHours(e.target.value)}
                        className="w-full"
                        required
                    />
                </div>
            </ModalContent>
            <ModalFooter>
                <Button onClick={onClose} variant="default">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="remarked"
                    disabled={!actualHours || loading}
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save'
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export const DraggableTaskCard = ({ task, onSelect, users, usersLoading, categories }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'TASK',
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const renderAssignedUserContent = () => {
        if (!task.assignedTo) return "Unassigned";

        if (usersLoading) {
            return <SkeletonText lines={1} className="w-24" />;
        }

        const assignedUser = users.find(u => u.id === task.assignedTo);
        if (assignedUser) {
            return `${assignedUser.firstName} ${assignedUser.lastName}`;
        }

        return "User not found";
    };

    const getCategoryName = () => {
        if (!task.category) return 'Unknown';

        const category = categories.find(cat => cat.id === task.category);
        return category ? category.name : 'Unknown';
    };

    return (
        <div
            ref={dragRef}
            className={`${isDragging ? 'opacity-80' : 'opacity-100'}`}
        >
            <Card
                className="hover:shadow-md transition-all cursor-pointer mb-4"
                onClick={() => onSelect(task.id)}
            >
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div className="flex-grow">
                            <div className="flex justify-between items-start my-3">
                                <h3 className="font-medium text-lg">{task.title}</h3>
                                <div className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[task.priority] || 'bg-gray-100'} border`}>
                                    {priorityLabels[task.priority] || 'Unknown'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        <div className="inline-flex items-center text-xs text-gray-600">
                            <Tag size={14} className="mr-1" />
                            {getCategoryName()}
                        </div>

                        <div className="inline-flex items-center text-xs text-gray-600">
                            <Clock size={14} className="mr-1" />
                            {task.estimatedHours}h
                        </div>

                        {task.realHours && (
                            <div className="inline-flex items-center text-xs text-green-600">
                                <CheckCircle size={14} className="mr-1" />
                                {task.realHours}h
                            </div>
                        )}

                        {task.assignedTo && (
                            <>
                                <div className="inline-flex items-center">
                                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                        <AvatarRenderer config={users.find(u => u.id === task.assignedTo)?.avatar} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">{renderAssignedUserContent()}</p>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export const TaskColumn = ({
                               icon,
                               title,
                               state,
                               tasks,
                               onTaskSelect,
                               onTaskDrop,
                               users,
                               usersLoading,
                               projectId
                           }) => {
    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: 'TASK',
        drop: (item) => onTaskDrop(item.id, state),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    const {categories} = useCategory();

    return (
        <div
            ref={dropRef}
            className={`flex flex-col h-full rounded-2xl border bg-card text-card-foreground shadow-sm p-4 ${isOver ? 'ring-2 ring-oracleRed' : ''}`}
        >
            <div className="flex items-center mb-4">
                <div className="text-oracleRed mr-4 flex items-center">
                    {icon}
                </div>
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>

            <div className="flex-grow overflow-y-auto">
                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-300 rounded-lg">
                        <ArrowDownCircle className="text-gray-400 mb-2" size={24} />
                        <p className="text-gray-500 text-sm">Drop tasks here</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <DraggableTaskCard
                            key={task.id}
                            task={task}
                            onSelect={onTaskSelect}
                            categories={categories}
                            users={users}
                            usersLoading={usersLoading}
                            projectId={projectId}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export const SprintSelector = ({ sprints, selectedSprint, onSprintChange, loading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedSprintObj = sprints.find(sprint => sprint.id === selectedSprint);

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd MMM yyyy');
        } catch (error) {
            return dateString;
        }
    };

    useEffect(() => {
        if (sprints.length > 0 && !selectedSprint) {
            const lastSprint = sprints.reduce((prev, current) =>
                (prev.sprintNumber > current.sprintNumber) ? prev : current
            );
            onSprintChange(lastSprint.id);
        }
    }, [sprints, selectedSprint, onSprintChange]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSprintSelect = (sprintId) => {
        onSprintChange(sprintId);
        setIsOpen(false);
    };

    if (loading) {
        return (
            <div className="w-48 h-10 bg-gray-200 animate-pulse rounded-md"></div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 w-full sm:min-w-[150px] sm:w-auto justify-between"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                {selectedSprintObj ? (
                    <div className="flex items-center gap-2 truncate">
                        <span className="truncate">Sprint {selectedSprintObj.sprintNumber}</span>
                    </div>
                ) : (
                    <span className="text-gray-500">Select a sprint</span>
                )}
                <FiChevronDown
                    size={16}
                    className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </Button>

            {isOpen && (
                <div
                    className="absolute right-0 left-0 mt-2 bg-white border rounded-md shadow-lg z-10 w-full min-w-[180px] max-h-[300px] overflow-y-auto"
                    role="listbox"
                >
                    {sprints.length === 0 ? (
                        <div className="px-4 py-3 text-gray-500 text-center">
                            No sprints available
                        </div>
                    ) : (
                        sprints
                            .sort((a, b) => b.sprintNumber - a.sprintNumber)
                            .map((sprint) => (
                                <div
                                    key={sprint.id}
                                    className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-150 ${
                                        selectedSprint === sprint.id ? 'bg-gray-50 text-oracleRed' : ''
                                    }`}
                                    onClick={() => handleSprintSelect(sprint.id)}
                                    role="option"
                                    aria-selected={selectedSprint === sprint.id}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">Sprint {sprint.sprintNumber}</span>
                                        <span className="text-sm text-gray-500">{formatDate(sprint.startDate)}</span>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            )}
        </div>
    );
};