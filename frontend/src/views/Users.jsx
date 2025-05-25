import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { UserCard, UserDetailsModal, RegisterModal, UsersHeader } from '../components/users/usersComponents';
import { ErrorMessage } from '../lib/ui/Loading';
import { SkeletonCard } from '../lib/ui/Skeleton';

export const Users = () => {
    const { users, loading, error, refetchUsers } = useUsers();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openUserDetails = (user) => {
        setSelectedUser(user);
        setIsUserDetailsModalOpen(true);
    };

    const handleRemoveUser = async (userId) => {
        setDeleteLoading(true);
        try {
            console.log('Remove user with ID:', userId);
            if (refetchUsers) {
                await refetchUsers();
            }

            setIsUserDetailsModalOpen(false);
        } catch (error) {
            console.error('Error removing user:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const openRegisterModal = () => {
        setIsRegisterModalOpen(true);
    };

    const closeRegisterModal = (success = false) => {
        setIsRegisterModalOpen(false);

        // If registration was successful, refetch users
        if (success && refetchUsers) {
            refetchUsers();
        }
    };

    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="container mx-auto px-4 py-6">
            <UsersHeader
                loading={loading}
                onAddUser={openRegisterModal}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <SkeletonCard key={index} header={true} lines={2} />
                    ))
                ) : (
                    <>
                        {users.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onDetailsClick={openUserDetails}
                            />
                        ))}
                        {users.length === 0 && (
                            <div className="col-span-3 text-center py-12 text-gray-500">
                                No users found. Click "Add User" to create one.
                            </div>
                        )}
                    </>
                )}
            </div>

            <UserDetailsModal
                user={selectedUser}
                isOpen={isUserDetailsModalOpen}
                onClose={() => setIsUserDetailsModalOpen(false)}
                onRemoveClick={handleRemoveUser}
                deleteLoading={deleteLoading}
            />

            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={(success) => closeRegisterModal(success)}
            />
        </div>
    );
};

export default Users;