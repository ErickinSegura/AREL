import { useState, useEffect } from 'react';
import { fetchItems, addItem as apiAddItem, deleteItem as apiDeleteItem, updateItemStatus as apiUpdateStatus } from '../api/sprintService';
import { FiList, FiClock, FiCheckCircle } from 'react-icons/fi';

const useSprintBoard = () => {
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

    const [columns, setColumns] = useState({
        toDo: {
            name: 'To Do',
            icon: <FiList className="mr-2 text-oracleRed" />,
            items: []
        },
        inProgress: {
            name: 'In Progress',
            icon: <FiClock className="mr-2 text-oracleRed" />,
            items: []
        },
        finished: {
            name: 'Finished',
            icon: <FiCheckCircle className="mr-2 text-oracleRed" />,
            items: []
        }
    });

    useEffect(() => {
        if (items.length) {
            setColumns({
                toDo: {
                    name: 'To Do',
                    icon: <FiList className="mr-2" />,
                    items: items.filter(item => !item.done && !item.inProgress)
                },
                inProgress: {
                    name: 'In Progress',
                    icon: <FiClock className="mr-2" />,
                    items: items.filter(item => !item.done && item.inProgress)
                },
                finished: {
                    name: 'Finished',
                    icon: <FiCheckCircle className="mr-2" />,
                    items: items.filter(item => item.done)
                }
            });
        }
    }, [items]);

    // Fetch items from API on component mount
    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            try {
                const data = await fetchItems();
                setItems(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadItems();
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

        handleUpdateItemStatus(draggedItem.id, draggedItem.description, inProgress, done).then(r => r);
    };

    // Add a new item
    const handleAddItem = async (text, status) => {
        if (!text.trim()) return;

        setInserting(true);
        try {
            const newItem = await apiAddItem(text, status);
            setItems([newItem, ...items]);
            setNewItemText('');
            setShowAddForm({
                toDo: false,
                inProgress: false,
                finished: false
            });
        } catch (err) {
            setError(err);
        } finally {
            setInserting(false);
        }
    };

    // Delete an item
    const handleDeleteItem = async (deleteId) => {
        try {
            await apiDeleteItem(deleteId);
            const remainingItems = items.filter(item => item.id !== deleteId);
            setItems(remainingItems);
        } catch (err) {
            setError(err);
        }
    };

    // Update item status
    const handleUpdateItemStatus = async (id, description, inProgress, done) => {
        try {
            await apiUpdateStatus(id, description, inProgress, done);
            const updatedItems = items.map(item =>
                item.id === id ? { ...item, inProgress, done } : item
            );
            setItems(updatedItems);
        } catch (err) {
            setError(err);
        }
    };

    // Toggle add form visibility
    const toggleAddForm = (columnId) => {
        setShowAddForm({
            toDo: false,
            inProgress: false,
            finished: false,
            [columnId]: !showAddForm[columnId]
        });

        if (showAddForm[columnId]) {
            setNewItemText('');
        }
    };

    return {
        isLoading,
        isInserting,
        items,
        error,
        newItemText,
        setNewItemText,
        showAddForm,
        columns,
        onDragEnd,
        handleAddItem,
        handleDeleteItem,
        toggleAddForm
    };
};

export default useSprintBoard;