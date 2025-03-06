import React, { useState, useEffect } from 'react';
import API_LIST from '../API';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Button, CircularProgress, Avatar } from '@mui/material';
import Moment from 'react-moment';

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

    // Filter items by status
    const toDoItems = items.filter(item => !item.done && !item.inProgress);
    const inProgressItems = items.filter(item => !item.done && item.inProgress);
    const finishedItems = items.filter(item => item.done);

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

    // Move item to next column
    const moveForward = (item) => {
        if (!item.inProgress && !item.done) {
            updateItemStatus(item.id, item.description, true, false);
        } else if (item.inProgress && !item.done) {
            updateItemStatus(item.id, item.description, false, true);
        }
    };

    // Move item to previous column
    const moveBackward = (item) => {
        if (item.done) {
            updateItemStatus(item.id, item.description, true, false);
        } else if (item.inProgress) {
            updateItemStatus(item.id, item.description, false, false);
        }
    };

    // Render a task card
    const renderCard = (item, columnType) => {
        return (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow mb-3">
                <div className="flex justify-between items-start">
                    <div className="w-full">
                        <h3 className="font-medium mb-2">{item.description}</h3>
                        <div className="text-xs text-gray-500 mb-2">
                            <span>Sprint 1</span>
                            <span className="ml-2">
                                <Moment format="MMM Do hh:mm:ss">{item.createdAt}</Moment>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex space-x-2">
                        {columnType !== 'toDo' && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ArrowLeftIcon />}
                                onClick={() => moveBackward(item)}
                            >
                                Move Back
                            </Button>
                        )}
                        {columnType !== 'finished' && (
                            <Button
                                variant="outlined"
                                size="small"
                                endIcon={<ArrowRightIcon />}
                                onClick={() => moveForward(item)}
                            >
                                Move Forward
                            </Button>
                        )}
                        {columnType === 'finished' && (
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
                    </div>
                    <Avatar
                        src="/api/placeholder/32/32"
                        alt="User"
                        sx={{ width: 28, height: 28 }}
                    />
                </div>
            </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* To Do Column */}
                    <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">To Do</h2>
                            <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                                {toDoItems.length}
                            </span>
                        </div>

                        {showAddForm.toDo ? (
                            renderAddForm('toDo')
                        ) : (
                            <Button
                                fullWidth
                                variant="outlined"
                                className="mb-4"
                                startIcon={<AddIcon />}
                                onClick={() => setShowAddForm({ ...showAddForm, toDo: true })}
                            >
                                Add Item
                            </Button>
                        )}

                        <div className="space-y-3">
                            {toDoItems.map(item => renderCard(item, 'toDo'))}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">In Progress</h2>
                            <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                                {inProgressItems.length}
                            </span>
                        </div>

                        {showAddForm.inProgress ? (
                            renderAddForm('inProgress')
                        ) : (
                            <Button
                                fullWidth
                                variant="outlined"
                                className="mb-4"
                                startIcon={<AddIcon />}
                                onClick={() => setShowAddForm({ ...showAddForm, inProgress: true })}
                            >
                                Add Item
                            </Button>
                        )}

                        <div className="space-y-3">
                            {inProgressItems.map(item => renderCard(item, 'inProgress'))}
                        </div>
                    </div>

                    {/* Finished Column */}
                    <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Finished</h2>
                            <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                                {finishedItems.length}
                            </span>
                        </div>

                        {showAddForm.finished ? (
                            renderAddForm('finished')
                        ) : (
                            <Button
                                fullWidth
                                variant="outlined"
                                className="mb-4"
                                startIcon={<AddIcon />}
                                onClick={() => setShowAddForm({ ...showAddForm, finished: true })}
                            >
                                Add Item
                            </Button>
                        )}

                        <div className="space-y-3">
                            {finishedItems.map(item => renderCard(item, 'finished'))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sprints;