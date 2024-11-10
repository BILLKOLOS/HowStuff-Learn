import { cryptoConfig, validateConfig } from '@/config/crypto.config';
import CryptoJS from 'crypto-js';

validateConfig(cryptoConfig);

/**
 * Checks if a string is a valid encrypted value
 * @param str - String to check
 * @returns boolean
 */
const isEncryptedData = (str: string): boolean => {
    try {
        return str.length > 32 && /^[A-Za-z0-9+/=]+$/.test(str);
    } catch {
        return false;
    }
};

/**
 * Encrypts a value using AES encryption
 * @param value - The value to encrypt (can be any JSON-serializable value)
 * @returns Promise<string> - The encrypted string
 */
export const encrypt = async (value: any): Promise<string> => {
    try {
        const stringValue = JSON.stringify(value);
        const encrypted = CryptoJS.AES.encrypt(stringValue, cryptoConfig.ENCRYPTION_KEY).toString();
        return encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        return JSON.stringify(value);
    }
};

/**
 * Decrypts an encrypted string
 * @param encryptedValue - The encrypted string to decrypt
 * @returns Promise<any> - The decrypted value
 */
export const decrypt = async (encryptedValue: string): Promise<any> => {
    try {

        if (!isEncryptedData(encryptedValue)) {
            return JSON.parse(encryptedValue);
        }
        const decrypted = CryptoJS.AES.decrypt(encryptedValue, cryptoConfig.ENCRYPTION_KEY);
        const stringValue = decrypted.toString(CryptoJS.enc.Utf8);
        if (!stringValue) {
            throw new Error('Decryption resulted in empty string');
        }

        return JSON.parse(stringValue.toString());
    } catch (error) {
        console.error('Decryption error:', error);

        try {
            return JSON.parse(encryptedValue);
        } catch {
            return null;
        }
    }
};