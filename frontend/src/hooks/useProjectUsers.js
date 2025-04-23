import { useState, useEffect } from 'react';
import { UserService } from '../api/userService';

export const useProjectUsers = (projectId) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [usersLoading, setUsersLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [addingUsers, setAddingUsers] = useState(false);
    const [removingUserId, setRemovingUserId] = useState(null);

    // Fetch project users
    useEffect(() => {
        const fetchProjectUsers = async () => {
            if (!projectId) return;

            setUsersLoading(true);
            try {
                const data = await UserService.getUsersByProject(projectId);
                setUsers(data);
                setFilteredUsers(data);
                setUsersLoading(false);
            } catch (err) {
                setError(err.message);
                setUsersLoading(false);
            }
        };

        fetchProjectUsers();
    }, [projectId]);

    // Filter users based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleOpenAddUserModal = async () => {
        try {
            const allUsers = await UserService.getUsersByLevel([1, 2]);

            const projectUserIds = users.map(user => user.id);
            const usersToAdd = allUsers.filter(user => !projectUserIds.includes(user.id));

            setAvailableUsers(usersToAdd);
            setSelectedUsers([]);
            setIsAddUserModalOpen(true);
        } catch (err) {
            setError("Failed to load available users");
        }
    };

    const handleCloseAddUserModal = () => {
        setIsAddUserModalOpen(false);
        setSelectedUsers([]);
    };

    const toggleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleAddUsers = async () => {
        if (selectedUsers.length === 0) return;

        setAddingUsers(true);
        try {
            // Simulate API call to add users to project
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get full user objects for selected IDs
            const newUsers = availableUsers.filter(user => selectedUsers.includes(user.id));

            // Update state with new users
            setUsers(prevUsers => [...prevUsers, ...newUsers]);
            setAddingUsers(false);
            handleCloseAddUserModal();
        } catch (err) {
            setError("Failed to add users to project");
            setAddingUsers(false);
        }
    };

    const handleRemoveUser = async (userId) => {
        setRemovingUserId(userId);
        try {
            // Simulate API call to remove user from project
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update state by removing user
            setUsers(users.filter(user => user.id !== userId));
            setRemovingUserId(null);
        } catch (err) {
            setError("Failed to remove user from project");
            setRemovingUserId(null);
        }
    };

    const filterAvailableUsers = (searchVal) => {
        if (!searchVal) {
            return;
        }

        const searchTerm = searchVal.toLowerCase();
        const filtered = availableUsers.filter(user =>
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        setAvailableUsers(filtered);
    };

    return {
        users,
        filteredUsers,
        searchTerm,
        usersLoading,
        error,
        isAddUserModalOpen,
        availableUsers,
        selectedUsers,
        addingUsers,
        removingUserId,
        handleSearchChange,
        handleOpenAddUserModal,
        handleCloseAddUserModal,
        toggleUserSelection,
        handleAddUsers,
        handleRemoveUser,
        filterAvailableUsers
    };
};