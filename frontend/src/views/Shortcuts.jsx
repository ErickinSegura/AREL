import React from 'react';
import { useShortcuts } from '../hooks/useShortcuts';
import {
    ShortcutCard,
    ShortcutDetailModal,
    CreateShortcutModal, NoProjectShortcuts
} from '../components/shortcut/shortcutComponents';
import {Button} from "../lib/ui/Button";
import {Plus} from "lucide-react";
import {Header} from "../lib/ui/Header";
import {NoProjectState} from "../lib/ui/NoProject";
import {SkeletonCard} from "../lib/ui/Skeleton";

const Shortcuts = () => {
    const {
        selectedProject,
        shortcuts,
        selectedShortcut,
        loading,
        deleteLoading,
        isCreateModalOpen,
        isDetailsModalOpen,
        formData,
        validationError,
        setIsCreateModalOpen,
        setIsDetailsModalOpen,
        handleFormChange,
        handleCreateShortcut,
        handleUpdateShortcut,
        handleDeleteShortcut,
        handleSelectShortcut
    } = useShortcuts();


    if (!selectedProject) {
        return <NoProjectState
            title={"selected"}
            message={"Please select a project from the sidebar to view and edit its shortcuts."}/>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <Header
                title="Project"
                marked={"Shortcuts"}
                selectedProject={selectedProject}
                loading={loading}
                props={
                    <div className="flex space-x-2">
                        <Button
                            variant="remarked"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Shortcut
                        </Button>
                    </div>
                }
            />

            {/* Shortcuts List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <SkeletonCard key={index} header={true} lines={1} />
                    ))
                ) : shortcuts.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <NoProjectShortcuts/>
                    </div>
                ) : (
                    shortcuts.map(shortcut => (
                        <ShortcutCard
                            key={shortcut.id}
                            shortcut={shortcut}
                            onSelectShortcut={handleSelectShortcut}
                        />
                    ))
                )}
            </div>

            <CreateShortcutModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                formData={formData}
                validationError={validationError}
                loading={loading}
                onChange={handleFormChange}
                onSubmit={handleCreateShortcut}
            />

            {selectedShortcut && (
                <ShortcutDetailModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    shortcut={selectedShortcut}
                    onUpdate={handleUpdateShortcut}
                    onDelete={handleDeleteShortcut}
                    loading={loading}
                    deleteLoading={deleteLoading}
                />
            )}
        </div>
    );
};

export default Shortcuts;