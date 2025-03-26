import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Card, CardHeader, CardTitle } from '../lib/ui/Card';
import useSprintBoard from '../hooks/useSprint';
import { Button } from '../lib/ui/Button';
import {
    LoadingState,
    ErrorMessage,
    ColumnContent
} from '../components/sprints/sprintComponents';

const Sprints = () => {
    const {
        isLoading,
        isInserting,
        error,
        newItemText,
        setNewItemText,
        showAddForm,
        columns,
        onDragEnd,
        handleAddItem,
        handleDeleteItem,
        toggleAddForm
    } = useSprintBoard();

    return (
        <div className="p-6">
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Sprint Board</CardTitle>
                        <Button
                            variant="remarked"
                            color="error"
                        >
                            Complete Sprint
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {error && <ErrorMessage message={error.message} />}

            {isLoading ? (
                <LoadingState />
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(columns).map(([columnId, column]) => (
                            <Card key={columnId} className="transition-all duration-300 hover:shadow-md">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg flex items-center">
                                            {column.icon}
                                            {column.name}
                                        </CardTitle>
                                        <span className="px-2 py-1 border-oracleRed border-2 rounded-md text-sm font-medium">
                      {column.items.length}
                    </span>
                                    </div>
                                </CardHeader>

                                <Droppable droppableId={columnId}>
                                    {(provided) => (
                                        <ColumnContent
                                            columnId={columnId}
                                            column={column}
                                            provided={provided}
                                            showAddForm={showAddForm}
                                            newItemText={newItemText}
                                            setNewItemText={setNewItemText}
                                            isInserting={isInserting}
                                            onAddItem={handleAddItem}
                                            onToggleAddForm={toggleAddForm}
                                            onDeleteItem={handleDeleteItem}
                                        />
                                    )}
                                </Droppable>
                            </Card>
                        ))}
                    </div>
                </DragDropContext>
            )}
        </div>
    );
};

export default Sprints;