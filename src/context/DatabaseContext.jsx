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

    useEffect(() => {
        setSecureStorage('db_customers_secure', customers);
        localStorage.removeItem('db_customers'); // Cleanup legacy
    }, [customers]);

    // --- ACTIONS ---
    const addTransaction = (transaction) => {
        setTransactions(prev => [transaction, ...prev]);
        if (transaction.customerId) {
            updateCustomerSpend(transaction.customerId, transaction.total);
        }
    };

    const updateCustomerSpend = (customerId, amount) => {
        setCustomers(prev => prev.map(c =>
            c.id === customerId ? { ...c, spend: (c.spend || 0) + amount } : c
        ));
    };

    const addCustomer = (customer) => {
        setCustomers(prev => [...prev, { ...customer, id: Date.now(), spend: 0 }]);
    };

    const editCustomer = (id, updatedData) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
    };

    const deleteCustomer = (id) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
    };

    // Product CRUD
    const addProduct = (product) => {
        setProducts(prev => [...prev, { ...product, id: Date.now() }]);
    };

    const editProduct = (id, updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
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
        }
    };

    const deleteCategory = (category) => {
        setCategories(prev => prev.filter(c => c !== category));
    };

    return (
        <DatabaseContext.Provider value={{
            products,
            transactions,
            customers,
            settings,
            categories,
            addTransaction,
            updateCustomerSpend,
            addCustomer,
            editCustomer,
            deleteCustomer,
            addProduct,
            editProduct,
            deleteProduct,
            updateSettings,
            addCategory,
            deleteCategory
        }}>
            {children}
        </DatabaseContext.Provider>
    );
};
