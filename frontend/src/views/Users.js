import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { UserCard, UserDetailsSheet } from '../components/users/usersComponents';
import { LoadingSpinner, ErrorMessage } from '../lib/ui/Loading';
import { Button } from '../lib/ui/Button';
import { PlusCircle } from 'lucide-react';
import { useRoute } from '../contexts/RouteContext';

export const Users = () => {
    const { users, loading, error } = useUsers();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { setCurrentRoute } = useRoute();

    const openUserDetails = (user) => {
        setSelectedUser(user);
        setIsSheetOpen(true);
    };

    const handleRemoveUser = async (userId) => {
        console.log('Remove user with ID:', userId);
    };

    const navigateToRegister = () => {
        setCurrentRoute('/register');
    };

    if (loading) return <LoadingSpinner message="Loading users..." centered />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Team Members</h1>
                <Button
                    variant="remarked"
                    startIcon={<PlusCircle size={16} />}
                    onClick={navigateToRegister} // Agregamos el manejador de eventos onClick
                >
                    Add User
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        onDetailsClick={openUserDetails}
                        onRemoveClick={handleRemoveUser}
                    />
                ))}
            </div>

            <UserDetailsSheet
                user={selectedUser}
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
            />
        </div>
    );
};