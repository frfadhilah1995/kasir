import CryptoJS from 'crypto-js';

// Secret key for encryption - in a real app this should be an env var
// For this client-side only app, we use a hardcoded key to allow persistence across reloads
// This prevents "Inspect Element" snooping but not determined hacking if they have the source code
const SECRET_KEY = 'mitra-cuan-secure-storage-key-v1';

/**
 * Hash a password using SHA-256
 * @param {string} password 
 * @returns {string} Hashed password
 */
export const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString();
};

/**
 * Encrypt data before storing
 * @param {any} data 
 * @returns {string} Encrypted string
 */
export const encryptData = (data) => {
    try {
        const jsonString = JSON.stringify(data);
        return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    } catch (error) {
        console.error('Encryption failed:', error);
        return null;
    }
};

/**
 * Decrypt data after retrieving
 * @param {string} ciphertext 
 * @returns {any} Decrypted data
 */
export const decryptData = (ciphertext) => {
    try {
        if (!ciphertext) return null;
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};

/**
 * Secure wrapper for localStorage.getItem
 * @param {string} key 
 * @param {any} defaultValue 
 * @returns {any}
 */
export const getSecureStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;

    // Try to decrypt
    const decrypted = decryptData(saved);

    // If decryption returns null (invalid data or old unencrypted data), return default
    // This also handles migration from unencrypted to encrypted gracefully-ish
    // (Old unencrypted JSON might fail decryption or parse incorrectly, so we might reset data)
    // To support migration, we could try JSON.parse(saved) if decrypt fails, but for security we'll enforce encryption
    return decrypted !== null ? decrypted : defaultValue;
};

/**
 * Secure wrapper for localStorage.setItem
 * @param {string} key 
 * @param {any} value 
 */
export const setSecureStorage = (key, value) => {
    const encrypted = encryptData(value);
    if (encrypted) {
        localStorage.setItem(key, encrypted);
    }
};
