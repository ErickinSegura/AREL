import React, { useState, useEffect } from 'react';
import API_LIST from '../API';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Button, CircularProgress, Avatar } from '@mui/material';
import Moment from 'react-moment';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Sprints = () => {
    // States for managing data and UI
    const [isLoading, setLoading] = useState(false);
    const [isInserting, setInserting] = useState(false);
    const [items, setItems] = useState([]);
    const [error, setError] = useState();
    const [newItemText, setNewItemText] = useState('');
    const [showAddForm, setShowAddForm] = useState({
        toDo: false,
        inProgress: false,
        finished: false
    });

    // Categorized items
    const [columns, setColumns] = useState({
        toDo: {
            name: 'To Do',
            items: []
        },
        inProgress: {
            name: 'In Progress',
            items: []
        },
        finished: {
            name: 'Finished',
            items: []
        }
    });

    // Update columns when items change
    useEffect(() => {
        if (items.length) {
            setColumns({
                toDo: {
                    name: 'To Do',
                    items: items.filter(item => !item.done && !item.inProgress)
                },
                inProgress: {
                    name: 'In Progress',
                    items: items.filter(item => !item.done && item.inProgress)
                },
                finished: {
                    name: 'Finished',
                    items: items.filter(item => item.done)
                }
            });
        }
    }, [items]);

    // Fetch items from API on component mount
    useEffect(() => {
        setLoading(true);
        fetch(API_LIST)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong while fetching items');
                }
            })
            .then(
                (result) => {
                    // Add inProgress property to items if not already present
                    const enhancedResults = result.map(item => ({
                        ...item,
                        inProgress: item.inProgress === undefined ? false : item.inProgress
                    }));
                    setLoading(false);
                    setItems(enhancedResults);
                },
                (error) => {
                    setLoading(false);
                    setError(error);
                }
            );
    }, []);

    // Handle drag end
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        // If dropped in the same column at the same position
        if (source.droppableId === destination.droppableId &&
            source.index === destination.index) {
            return;
        }

        // Get the dragged item
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const draggedItem = sourceColumn.items[source.index];

        // Remove from source column
        const newSourceItems = Array.from(sourceColumn.items);
        newSourceItems.splice(source.index, 1);

        // Add to destination column
        const newDestItems = Array.from(destColumn.items);
        newDestItems.splice(destination.index, 0, draggedItem);

        // Update columns state
        const newColumns = {
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                items: newSourceItems
            },
            [destination.droppableId]: {
                ...destColumn,
                items: newDestItems
            }
        };

        setColumns(newColumns);

        // Update item status in the backend
        const inProgress = destination.droppableId === 'inProgress';
        const done = destination.droppableId === 'finished';

        updateItemStatus(draggedItem.id, draggedItem.description, inProgress, done);
    };

    // Add a new item
    const addItem = (text, status) => {
        setInserting(true);
        const data = {
            description: text,
            done: status === 'finished',
            inProgress: status === 'inProgress'
        };

        fetch(API_LIST, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                return response;
            } else {
                throw new Error('Something went wrong while adding item');
            }
        }).then(
            (result) => {
                const id = result.headers.get('location');
                const newItem = {
                    id: id,
                    description: text,
                    done: status === 'finished',
                    inProgress: status === 'inProgress',
                    createdAt: new Date()
                };
                setItems([newItem, ...items]);
                setInserting(false);
                setNewItemText('');
                setShowAddForm({
                    toDo: false,
                    inProgress: false,
                    finished: false
                });
            },
            (error) => {
                setInserting(false);
                setError(error);
            }
        );
    };

    // Delete an item
    const deleteItem = (deleteId) => {
        fetch(`${API_LIST}/${deleteId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    throw new Error('Something went wrong while deleting');
                }
            })
            .then(
                () => {
                    const remainingItems = items.filter(item => item.id !== deleteId);
                    setItems(remainingItems);
                },
                (error) => {
                    setError(error);
                }
            );
    };

    // Update item status
    const updateItemStatus = (id, description, inProgress, done) => {
        const data = {
            description: description,
            inProgress: inProgress,
            done: done
        };

        fetch(`${API_LIST}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    throw new Error('Something went wrong while updating');
                }
            })
            .then(
                () => {
                    const updatedItems = items.map(item =>
                        item.id === id ? { ...item, inProgress, done } : item
                    );
                    setItems(updatedItems);
                },
                (error) => {
                    setError(error);
                }
            );
    };

    // Render an "Add Item" form
    const renderAddForm = (columnType) => {
        return (
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter new task..."
                    className="w-full p-2 border rounded mb-2"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                />
                <div className="flex space-x-2">
                    <Button
                        variant="contained"
                        size="small"
                        disabled={isInserting || !newItemText}
                        onClick={() => addItem(newItemText, columnType)}
                    >
                        Add
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setShowAddForm({
                                toDo: false,
                                inProgress: false,
                                finished: false
                            });
                            setNewItemText('');
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Sprint Board</h1>
                <Button
                    variant="contained"
                    color="error"
                    className="bg-red-500"
                >
                    Complete Sprint
                </Button>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    Error: {error.message}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center my-8">
                    <CircularProgress />
                </div>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(columns).map(([columnId, column]) => (
                            <div key={columnId} className="bg-gray-100 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">{column.name}</h2>
                                    <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                                        {column.items.length}
                                    </span>
                                </div>

                                {showAddForm[columnId] ? (
                                    renderAddForm(columnId)
                                ) : (
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        className="mb-4"
                                        startIcon={<AddIcon />}
                                        onClick={() => setShowAddForm({ ...showAddForm, [columnId]: true })}
                                    >
                                        Add Item
                                    </Button>
                                )}

                                <Droppable droppableId={columnId}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="space-y-3 min-h-64"
                                        >
                                            {column.items.map((item, index) => (
                                                <Draggable
                                                    key={item.id}
                                                    draggableId={item.id.toString()}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`bg-white p-4 rounded-lg shadow mb-3 ${
                                                                snapshot.isDragging ? 'opacity-75 shadow-lg' : ''
                                                            }`}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="w-full">
                                                                    <div className="flex items-center">
                                                                        <div
                                                                            {...provided.dragHandleProps}
                                                                            className="cursor-move mr-2"
                                                                        >
                                                                            <DragIndicatorIcon fontSize="small" />
                                                                        </div>
                                                                        <h3 className="font-medium">{item.description}</h3>
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 mt-2 ml-6">
                                                                        <span>Sprint 1</span>
                                                                        <span className="ml-2">
                                                                            <Moment format="MMM Do hh:mm:ss">{item.createdAt}</Moment>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center mt-3 ml-6">
                                                                {columnId === 'finished' && (
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="error"
                                                                        size="small"
                                                                        startIcon={<DeleteIcon />}
                                                                        onClick={() => deleteItem(item.id)}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                )}
                                                                <div className="ml-auto">
                                                                    <Avatar
                                                                        src="/api/placeholder/32/32"
                                                                        alt="User"
                                                                        sx={{ width: 28, height: 28 }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            )}
        </div>
    );
};

export default Sprints;