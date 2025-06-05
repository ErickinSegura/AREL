import React, { useState, useMemo } from 'react';
import { useUsers } from '../hooks/useUsers';
import { UserCard, UserDetailsModal, RegisterModal, UsersHeader } from '../components/users/usersComponents';
import { SkeletonCard } from '../lib/ui/Skeleton';
import { ErrorState } from "../lib/ui/Error";
import { Input } from '../lib/ui/Input';
import { Search, X } from 'lucide-react';

export const Users = () => {
    const { users, loading, error, refetchUsers } = useUsers();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;

        const term = searchTerm.toLowerCase().trim();
        return users.filter(user =>
            user.firstName?.toLowerCase().includes(term) ||
            user.lastName?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term) ||
            user.username?.toLowerCase().includes(term) ||
            user.telegramUsername?.toLowerCase().includes(term) ||
            user.userLevel?.label?.toLowerCase().includes(term) ||
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(term)
        );
    }, [users, searchTerm]);

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

    const clearSearch = () => {
        setSearchTerm('');
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

            {/* Search Section */}
            {!loading && (
                <div className="mb-6">
                    <div className="mx-auto">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search users by name, email, username, or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<Search size={18} className="text-gray-400" />}
                                className="w-full"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <SkeletonCard key={index} header={true} lines={2} />
                    ))
                ) : (
                    <>
                        {filteredUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onDetailsClick={openUserDetails}
                            />
                        ))}
                        {filteredUsers.length === 0 && !searchTerm && (
                            <div className="col-span-3 text-center py-12 text-gray-500">
                                No users found. Click "Add User" to create one.
                            </div>
                        )}
                        {filteredUsers.length === 0 && searchTerm && (
                            <div className="col-span-3 text-center py-12 text-gray-500">
                                <div className="flex flex-col items-center gap-2">
                                    <Search size={48} className="text-gray-300" />
                                    <p className="text-lg font-medium">No users found</p>
                                    <p className="text-sm">Try adjusting your search terms or check for typos.</p>
                                </div>
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

