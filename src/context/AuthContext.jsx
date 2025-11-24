import React, { createContext, useContext, useState, useEffect } from 'react';
import { hashPassword, getSecureStorage, setSecureStorage } from '../utils/security';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Default Admin User with Hashed Password
    // Password is 'admin123'
    const defaultAdmin = {
        id: 1,
        username: 'admin',
        password: hashPassword('admin123'),
        role: 'owner',
        name: 'Store Owner'
    };

    // Load users from secure storage
    const [users, setUsers] = useState(() => {
        const saved = getSecureStorage('db_users_secure', null);
        // If no secure data, check for old insecure data to migrate (optional, but good for UX)
        if (!saved) {
            const oldData = localStorage.getItem('db_users');
            if (oldData) {
                // We could migrate, but for security let's start fresh or use default
                // To be safe and secure, we default to admin
                return [defaultAdmin];
            }
            return [defaultAdmin];
        }
        return saved;
    });

    // Current logged in user
    const [user, setUser] = useState(() => {
        return getSecureStorage('active_user_secure', null);
    });

    useEffect(() => {
        setSecureStorage('db_users_secure', users);
    }, [users]);

    useEffect(() => {
        if (user) {
            setSecureStorage('active_user_secure', user);
        } else {
            localStorage.removeItem('active_user_secure');
        }
    }, [user]);

    const login = (username, password) => {
        // Hash input password to compare
        const hashedPassword = hashPassword(password);
        const foundUser = users.find(u => u.username === username && u.password === hashedPassword);

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

        // Hash password before saving
        const userToSave = {
            ...newUser,
            id: Date.now(),
            password: hashPassword(newUser.password)
        };

        setUsers(prev => [...prev, userToSave]);
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

        // Handle password update if present
        let dataToUpdate = { ...updatedData };
        if (dataToUpdate.password) {
            dataToUpdate.password = hashPassword(dataToUpdate.password);
        }

        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...dataToUpdate } : u));

        // Update current user session if it's the same user
        if (user && user.id === id) {
            setUser(prev => ({ ...prev, ...dataToUpdate }));
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
