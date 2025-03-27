import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import { CircularProgress, Avatar } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import { CardContent } from '../../lib/ui/Card';
import { Button } from '../../lib/ui/Button';
import { Sheet } from '../../lib/ui/Sheet';

// Loading state component
export const LoadingState = () => (
    <div className="flex flex-col items-center justify-center my-12 py-12">
        <div className="relative">
            <CircularProgress
                size={60}
                className="z-10"
                sx={{ color: '#C74634' }}
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <div className="animate-pulse bg-red-100 rounded-full w-16 h-16"></div>
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

// Add item form component
const AddItemForm = ({
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
const AddItemButton = ({ onClick }) => (
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
const SprintItem = ({
                               item,
                               index,
                               columnId,
                               onDelete
                           }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <>
            <Draggable
                key={item.id}
                draggableId={item.id.toString()}
                index={index}
            >
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white rounded-lg border transition-all duration-300 cursor-pointer
                        ${snapshot.isDragging
                            ? 'opacity-75 shadow-lg border-oracleRed'
                            : 'hover:shadow-md hover:border-gray-300'
                        }`}
                        onClick={() => setIsSheetOpen(true)}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="w-full">
                                    <div className="flex items-center">
                                        <h3 className="font-medium">{item.description}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-3 ml-6">
                                <div className="ml-auto">
                                    <Avatar
                                        src="https://external-preview.redd.it/TwU07Lr9HX8Ayouj-4fyQfJBp3XuCyG7I9Q0n8KhF7M.jpg?auto=webp&s=3ab8215d552fd36f052da9aec8aaeaf43e0e2926"
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

            <Sheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                side="right"
                title={`Task #${item.id}`}
                description="Task Details"
            >
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                        <p className="text-lg font-medium">{item.description}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-50 mb-1">Status</h4>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-oracleRed">
                            {columnId === 'todo' && 'To Do'}
                            {columnId === 'inProgress' && 'In Progress'}
                            {columnId === 'finished' && 'Finished'}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h4>
                        <div className="flex items-center">
                            <Avatar
                                src="https://external-preview.redd.it/TwU07Lr9HX8Ayouj-4fyQfJBp3XuCyG7I9Q0n8KhF7M.jpg?auto=webp&s=3ab8215d552fd36f052da9aec8aaeaf43e0e2926"
                                alt="User"
                                sx={{ width: 32, height: 32 }}
                            />
                            <span className="ml-2">User Name</span>
                        </div>
                    </div>

                    {item.created && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Created</h4>
                            <p>{new Date(item.created).toLocaleString()}</p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FiEdit />}
                                onClick={() => {
                                    // Acción de editar
                                    setIsSheetOpen(false);
                                }}
                            >
                                Edit Task
                            </Button>

                            <Button
                                variant="danger"
                                size="small"
                                startIcon={<FiTrash2 />}
                                onClick={() => {
                                    onDelete(item.id);
                                    setIsSheetOpen(false);
                                }}
                            >
                                Delete Task
                            </Button>
                        </div>
                    </div>
                </div>
            </Sheet>
        </>
    );
};

