import React from 'react';
import { useShortcuts } from '../hooks/useShortcuts';
import {
    NoProjectState,
    ShortcutsHeader,
    ShortcutCard,
    ShortcutDetailModal,
    CreateShortcutModal, NoProjectShortcuts
} from '../components/shortcut/shortcutComponents';

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
            <ShortcutsHeader
                selectedProject={selectedProject}
                loading={loading}
                onAddShortcut={() => setIsCreateModalOpen(true)}
            />

            {/* Shortcuts List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    Array(6).fill(0).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                <div className="ml-3 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                        </div>
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