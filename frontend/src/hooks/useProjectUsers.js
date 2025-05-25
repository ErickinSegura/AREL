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
    const [allAvailableUsers, setAllAvailableUsers] = useState([]); // Para mantener la lista completa
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [addingUsers, setAddingUsers] = useState(false);
    const [removingUserId, setRemovingUserId] = useState(null);
    const [loadingAvailableUsers, setLoadingAvailableUsers] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userRoles, setUserRoles] = useState({}); // Para almacenar el rol de cada usuario seleccionado

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
        setIsAddUserModalOpen(true);
        setLoadingAvailableUsers(true);
        setSelectedUsers([]);
        setUserRoles({});

        try {
            const allUsers = await UserService.getAvailableUsers([1, 2]);
            const projectUserIds = users.map(user => user.userId);
            const usersToAdd = allUsers.filter(user => !projectUserIds.includes(user.id));

            setAllAvailableUsers(usersToAdd);
            setAvailableUsers(usersToAdd);
            setLoadingAvailableUsers(false);
        } catch (err) {
            setError("Failed to load available users");
            setLoadingAvailableUsers(false);
        }
    };

    const handleCloseAddUserModal = () => {
        setIsAddUserModalOpen(false);
        setSelectedUsers([]);
        setUserRoles({});
        setAvailableUsers([]);
        setAllAvailableUsers([]);
    };

    const toggleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
            const newUserRoles = { ...userRoles };
            delete newUserRoles[userId];
            setUserRoles(newUserRoles);
        } else {
            setSelectedUsers([...selectedUsers, userId]);
            setUserRoles(prev => ({ ...prev, [userId]: 'member' }));
        }
    };

    const handleAddUsers = async () => {
        if (selectedUsers.length === 0) return;

        setAddingUsers(true);
        try {
            const assignPromises = selectedUsers.map(userId =>
                UserService.assignUserToProject(userId, projectId, userRoles[userId] || 'member')
            );

            await Promise.all(assignPromises);

            const updatedUsers = await UserService.getUsersByProject(projectId);
            setUsers(updatedUsers);

            setAddingUsers(false);
            handleCloseAddUserModal();
        } catch (err) {
            console.error('Error adding users:', err);
            setError(err.message || "Failed to add users to project");
            setAddingUsers(false);
        }
    };

    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleConfirmRemoveUser = async () => {
        if (!userToDelete) return;

        setRemovingUserId(userToDelete.id);
        try {
            await UserService.removeUserFromProject(userToDelete.userProjectId);

            setUsers(prevUsers =>
                prevUsers.filter(user => user.userProjectId !== userToDelete.userProjectId)
            );

            setRemovingUserId(null);
            handleCloseDeleteModal();
        } catch (err) {
            console.error('Error removing user:', err);
            setError(err.message || "Failed to remove user from project");
            setRemovingUserId(null);
            handleCloseDeleteModal();
        }
    };

    const filterAvailableUsers = (searchVal) => {
        if (!searchVal) {
            setAvailableUsers(allAvailableUsers);
            return;
        }

        const searchTerm = searchVal.toLowerCase();
        const filtered = allAvailableUsers.filter(user =>
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        setAvailableUsers(filtered);
    };

    const handleUserRoleChange = (userId, role) => {
        setUserRoles(prev => ({ ...prev, [userId]: role }));
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
        loadingAvailableUsers,
        isDeleteModalOpen,
        userToDelete,
        userRoles,
        handleSearchChange,
        handleOpenAddUserModal,
        handleCloseAddUserModal,
        toggleUserSelection,
        handleAddUsers,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleConfirmRemoveUser,
        filterAvailableUsers,
        handleUserRoleChange
    };
};