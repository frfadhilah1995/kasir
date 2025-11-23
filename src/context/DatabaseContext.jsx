import React, { createContext, useContext, useState, useEffect } from 'react';

const DatabaseContext = createContext();

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
    // --- STATE ---
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('db_products');
        return saved ? JSON.parse(saved) : [];
    });

    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('db_transactions');
        return saved ? JSON.parse(saved) : [];
    });

    const [customers, setCustomers] = useState(() => {
        const saved = localStorage.getItem('db_customers');
        return saved ? JSON.parse(saved) : [];
    });

    // --- PERSISTENCE ---
    useEffect(() => {
        localStorage.setItem('db_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('db_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('db_customers', JSON.stringify(customers));
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
        const saved = localStorage.getItem('db_settings');
        return saved ? JSON.parse(saved) : {
            storeName: 'Mitra Cuan Store',
            taxRate: 11,
            currency: 'IDR (Rp)',
            address: 'Jalan Teknologi No. 123, Jakarta Selatan'
        };
    });

    useEffect(() => {
        localStorage.setItem('db_settings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('db_categories');
        return saved ? JSON.parse(saved) : ["Food", "Fashion", "Accessories", "Electronics", "Other"];
    });

    useEffect(() => {
        localStorage.setItem('db_categories', JSON.stringify(categories));
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
