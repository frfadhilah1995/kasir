import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSecureStorage, setSecureStorage } from '../utils/security';

const DatabaseContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
    // --- STATE ---
    const [products, setProducts] = useState(() => {
        return getSecureStorage('db_products_secure', []);
    });

    const [transactions, setTransactions] = useState(() => {
        return getSecureStorage('db_transactions_secure', []);
    });

    const [customers, setCustomers] = useState(() => {
        return getSecureStorage('db_customers_secure', []);
    });

    // --- PERSISTENCE ---
    useEffect(() => {
        setSecureStorage('db_products_secure', products);
        localStorage.removeItem('db_products'); // Cleanup legacy
    }, [products]);

    useEffect(() => {
        setSecureStorage('db_transactions_secure', transactions);
        localStorage.removeItem('db_transactions'); // Cleanup legacy
    }, [transactions]);

    const [auditLogs, setAuditLogs] = useState(() => {
        return getSecureStorage('db_audit_logs_secure', []);
    });

    useEffect(() => {
        setSecureStorage('db_audit_logs_secure', auditLogs);
    }, [auditLogs]);

    const addAuditLog = (action, details, user) => {
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            user: user || 'System',
            action,
            details
        };
        setAuditLogs(prev => [newLog, ...prev].slice(0, 1000)); // Keep last 1000 logs
    };

    // --- ACTIONS ---
    const addTransaction = (transaction) => {
        setTransactions(prev => [transaction, ...prev]);
        if (transaction.customerId) {
            updateCustomerSpend(transaction.customerId, transaction.total);
        }
        addAuditLog('ADD_TRANSACTION', `Transaction ${transaction.id} created for ${transaction.total}`, 'Cashier');
    };

    const voidTransaction = (id, user) => {
        const transaction = transactions.find(t => t.id === id);
        if (!transaction) return { success: false, message: 'Transaction not found' };
        if (transaction.status === 'Void') return { success: false, message: 'Transaction already voided' };

        // Reverse customer spend if applicable
        if (transaction.customerId) {
            updateCustomerSpend(transaction.customerId, -transaction.total);
        }

        // Update transaction status
        setTransactions(prev => prev.map(t =>
            t.id === id ? { ...t, status: 'Void' } : t
        ));

        addAuditLog('VOID_TRANSACTION', `Voided transaction ID: ${id}`, user || 'Admin');
        return { success: true };
    };

    const updateCustomerSpend = (customerId, amount) => {
        setCustomers(prev => prev.map(c =>
            c.id === customerId ? { ...c, spend: (c.spend || 0) + amount } : c
        ));
    };

    const addCustomer = (customer) => {
        if (!customer.name || customer.name.trim() === '') {
            return { success: false, message: 'Customer name is required' };
        }
        setCustomers(prev => [...prev, { ...customer, id: Date.now(), spend: 0 }]);
        addAuditLog('ADD_CUSTOMER', `Added customer: ${customer.name}`, 'Admin');
        return { success: true };
    };

    const editCustomer = (id, updatedData) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
        addAuditLog('EDIT_CUSTOMER', `Edited customer ID: ${id}`, 'Admin');
        return { success: true };
    };

    const deleteCustomer = (id) => {
        // Integrity Check: Cannot delete customer with active transactions
        const hasTransactions = transactions.some(t => t.customerId === id);
        if (hasTransactions) {
            return { success: false, message: 'Cannot delete customer with active transactions.' };
        }
        setCustomers(prev => prev.filter(c => c.id !== id));
        addAuditLog('DELETE_CUSTOMER', `Deleted customer ID: ${id}`, 'Admin');
        return { success: true };
    };

    // Product CRUD
    const addProduct = (product) => {
        // Validation
        if (!product.name || product.name.trim() === '') return { success: false, message: 'Product name is required' };
        if (product.price < 0) return { success: false, message: 'Price cannot be negative' };

        setProducts(prev => [...prev, { ...product, id: Date.now() }]);
        addAuditLog('ADD_PRODUCT', `Added product: ${product.name}`, 'Admin');
        return { success: true };
    };

    const editProduct = (id, updatedProduct) => {
        if (updatedProduct.price < 0) return { success: false, message: 'Price cannot be negative' };

        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
        addAuditLog('EDIT_PRODUCT', `Edited product ID: ${id}`, 'Admin');
        return { success: true };
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        addAuditLog('DELETE_PRODUCT', `Deleted product ID: ${id}`, 'Admin');
        return { success: true };
    };

    const [settings, setSettings] = useState(() => {
        return getSecureStorage('db_settings_secure', {
            storeName: 'Mitra Cuan Store',
            taxRate: 11,
            currency: 'IDR (Rp)',
            address: 'Jalan Teknologi No. 123, Jakarta Selatan'
        });
    });

    useEffect(() => {
        setSecureStorage('db_settings_secure', settings);
        localStorage.removeItem('db_settings'); // Cleanup legacy
    }, [settings]);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
        addAuditLog('UPDATE_SETTINGS', 'Updated store settings', 'Owner');
    };

    const [categories, setCategories] = useState(() => {
        return getSecureStorage('db_categories_secure', ["Food", "Fashion", "Accessories", "Electronics", "Other"]);
    });

    useEffect(() => {
        setSecureStorage('db_categories_secure', categories);
        localStorage.removeItem('db_categories'); // Cleanup legacy
    }, [categories]);

    const addCategory = (category) => {
        if (!categories.includes(category)) {
            setCategories(prev => [...prev, category]);
            addAuditLog('ADD_CATEGORY', `Added category: ${category}`, 'Admin');
        }
    };

    const deleteCategory = (category) => {
        setCategories(prev => prev.filter(c => c !== category));
        addAuditLog('DELETE_CATEGORY', `Deleted category: ${category}`, 'Admin');
    };

    // Backup & Restore
    const exportData = () => {
        const data = {
            products,
            transactions,
            customers,
            settings,
            categories,
            auditLogs,
            version: '1.0.0',
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(data);
    };

    const importData = (jsonString) => {
        try {
            const data = JSON.parse(jsonString);
            // Basic validation
            if (!data.version || !data.products) throw new Error('Invalid backup file');

            setProducts(data.products || []);
            setTransactions(data.transactions || []);
            setCustomers(data.customers || []);
            setSettings(data.settings || settings);
            setCategories(data.categories || categories);
            setAuditLogs(data.auditLogs || []);

            addAuditLog('IMPORT_DATA', 'Restored data from backup', 'Admin');
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Failed to import data: ' + error.message };
        }
    };

    return (
        <DatabaseContext.Provider value={{
            products,
            transactions,
            customers,
            settings,
            categories,
            auditLogs,
            addTransaction,
            voidTransaction,
            updateCustomerSpend,
            addCustomer,
            editCustomer,
            deleteCustomer,
            addProduct,
            editProduct,
            deleteProduct,
            updateSettings,
            addCategory,
            deleteCategory,
            exportData,
            importData
        }}>
            {children}
        </DatabaseContext.Provider>
    );
};
