import React from 'react';
import { FiPlus, FiMenu, FiTrash2 } from 'react-icons/fi';
import { CircularProgress, Avatar } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import { CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

// Loading state component
export const LoadingState = () => (
    <div className="flex flex-col items-center justify-center my-12 py-12">
        <div className="relative">
            <CircularProgress size={60} className="z-10" />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <div className="animate-pulse bg-blue-100 rounded-full w-16 h-16"></div>
            </div>
        </div>
        <p className="mt-4 text-gray-500 animate-pulse">Loading sprint board...</p>
    </div>
);

// Error message component
export const ErrorMessage = ({ message }) => (
    <div className="bg-red-100 p-4 rounded-lg mb-4">
        <p className="text-red-700">Error: {message}</p>
    </div>
);

// Add item form component
export const AddItemForm = ({
                                newItemText,
                                setNewItemText,
                                isInserting,
                                onAdd,
                                onCancel
                            }) => (
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
                variant="primary"
                size="small"
                disabled={isInserting || !newItemText}
                onClick={onAdd}
            >
                Add
            </Button>
            <Button
                variant="outlined"
                size="small"
                onClick={onCancel}
            >
                Cancel
            </Button>
        </div>
    </div>
);

// Add item button component
export const AddItemButton = ({ onClick }) => (
    <Button
        fullWidth
        className="mb-4"
        startIcon={<FiPlus style={{
            color: '#C74634',
        }}/>}
        onClick={onClick}
    >
        <b>Add Item</b>
    </Button>
);

// Sprint item component
export const SprintItem = ({
                               item,
                               index,
                               columnId,
                               onDelete
                           }) => (
    <Draggable
        key={item.id}
        draggableId={item.id.toString()}
        index={index}
    >
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={`bg-white rounded-lg border transition-all duration-300 
                ${snapshot.isDragging
                    ? 'opacity-75 shadow-lg border-oracleRed'
                    : 'hover:shadow-md hover:border-gray-300'
                }`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="w-full">
                            <div className="flex items-center">
                                <div
                                    {...provided.dragHandleProps}
                                    className="cursor-move mr-2 text-gray-400 hover:text-gray-700 transition-colors"
                                >
                                    <FiMenu size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 ml-6">
                        {columnId === 'finished' && (
                            <Button
                                variant="danger"
                                size="small"
                                startIcon={<FiTrash2 />}
                                onClick={() => onDelete(item.id)}
                            >
                                Delete
                            </Button>
                        )}
                        <div className="ml-auto">
                            <Avatar
                                src="/api/placeholder/32/32"
                                alt="User"
                                sx={{ width: 28, height: 28 }}
                                className="transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}
    </Draggable>
);

// Column content component
export const ColumnContent = ({
                                  columnId,
                                  column,
                                  provided,
                                  showAddForm,
                                  newItemText,
                                  setNewItemText,
                                  isInserting,
                                  onAddItem,
                                  onToggleAddForm,
                                  onDeleteItem
                              }) => (
    <CardContent>
        {showAddForm[columnId] ? (
            <AddItemForm
                newItemText={newItemText}
                setNewItemText={setNewItemText}
                isInserting={isInserting}
                onAdd={() => onAddItem(newItemText, columnId)}
                onCancel={() => onToggleAddForm(columnId)}
            />
        ) : (
            <AddItemButton onClick={() => onToggleAddForm(columnId)} />
        )}

        <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 min-h-64"
        >
            {column.items.map((item, index) => (
                <SprintItem
                    key={item.id}
                    item={item}
                    index={index}
                    columnId={columnId}
                    onDelete={onDeleteItem}
                />
            ))}
            {provided.placeholder}
        </div>
    </CardContent>
);