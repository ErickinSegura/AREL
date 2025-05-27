import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { UserCard, UserDetailsModal, RegisterModal, UsersHeader } from '../components/users/usersComponents';
import { SkeletonCard } from '../lib/ui/Skeleton';
import {ErrorState} from "../lib/ui/Error";

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


    const openRegisterModal = () => {
        setIsRegisterModalOpen(true);
    };

    const closeRegisterModal = (success = false) => {
        setIsRegisterModalOpen(false);

        if (success && refetchUsers) {
            refetchUsers();
        }
    };

    if (error) {
        return <ErrorState error={error} />;
    }

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
            />

            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={(success) => closeRegisterModal(success)}
            />
        </div>
    );
};

export default Users;