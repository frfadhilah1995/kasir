import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Default Admin User
    const defaultAdmin = {
        id: 1,
        username: 'admin',
        password: 'admin123', // In a real app, this should be hashed
        role: 'owner',
        name: 'Store Owner'
    };

    // Load users from localStorage or use default
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('db_users');
        return saved ? JSON.parse(saved) : [defaultAdmin];
    });

    // Current logged in user
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('active_user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        localStorage.setItem('db_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('active_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('active_user');
        }
    }, [user]);

    const login = (username, password) => {
        const foundUser = users.find(u => u.username === username && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            return { success: true };
        }
        return { success: false, message: 'Invalid username or password' };
    };

    const logout = () => {
        setUser(null);
    };

    // User Management (Admin Only)
    const addUser = (newUser) => {
        if (users.some(u => u.username === newUser.username)) {
            return { success: false, message: 'Username already exists' };
        }

        // Check for single admin restriction
        if (newUser.role === 'owner') {
            const adminCount = users.filter(u => u.role === 'owner').length;
            if (adminCount >= 1) {
                return { success: false, message: 'Only one Admin (Owner) is allowed.' };
            }
        }

        setUsers(prev => [...prev, { ...newUser, id: Date.now() }]);
        return { success: true };
    };

    const updateUser = (id, updatedData) => {
        // Check username uniqueness if changed
        if (updatedData.username) {
            const existing = users.find(u => u.username === updatedData.username && u.id !== id);
            if (existing) return { success: false, message: 'Username already taken' };
        }

        // Check for single admin restriction if role is being updated to owner
        if (updatedData.role === 'owner') {
            const existingAdmins = users.filter(u => u.role === 'owner' && u.id !== id);
            if (existingAdmins.length >= 1) {
                return { success: false, message: 'Only one Admin (Owner) is allowed.' };
            }
        }

        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedData } : u));

        // Update current user session if it's the same user
        if (user && user.id === id) {
            setUser(prev => ({ ...prev, ...updatedData }));
        }
        return { success: true };
    };

    const deleteUser = (id) => {
        const userToDelete = users.find(u => u.id === id);
        if (!userToDelete) return { success: false, message: 'User not found' };

        // Prevent deleting the last admin
        if (userToDelete.role === 'owner') {
            const adminCount = users.filter(u => u.role === 'owner').length;
            if (adminCount <= 1) {
                return { success: false, message: 'Cannot delete the only Admin account. Create another Admin first.' };
            }
        }

        setUsers(prev => prev.filter(u => u.id !== id));
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, users, addUser, updateUser, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};
