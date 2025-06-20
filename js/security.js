// Funkcije za enkripciju i dekripciju podataka
const ENCRYPTION_KEY = 'laser-app-key-' + new Date().getFullYear();

export const securityUtils = {
    // Enkriptuj podatke pre čuvanja
    encryptData: function(data) {
        try {
            const dataStr = JSON.stringify(data);
            // Osnovna enkripcija za localStorage (može se unaprediti sa više sigurnosti)
            const encoded = btoa(encodeURIComponent(dataStr));
            return encoded;
        } catch (error) {
            console.error('Greška pri enkripciji:', error);
            return null;
        }
    },

    // Dekriptuj podatke nakon čitanja
    decryptData: function(encryptedData) {
        try {
            // Dekriptuj enkriptovane podatke
            const decoded = decodeURIComponent(atob(encryptedData));
            return JSON.parse(decoded);
        } catch (error) {
            console.error('Greška pri dekripciji:', error);
            return null;
        }
    },

    // Validacija podataka
    validateData: function(data) {
        if (!data) return false;
        
        // Provera osnovne strukture podataka
        const requiredFields = ['potrosnja', 'prihod', 'poslovi', 'nabavke'];
        return requiredFields.every(field => Array.isArray(data[field]));
    },

    // Čuvanje podataka sa enkripcijom
    saveSecureData: function(key, data) {
        const encrypted = this.encryptData(data);
        if (encrypted) {
            try {
                localStorage.setItem(key, encrypted);
                return true;
            } catch (error) {
                console.error('Greška pri čuvanju:', error);
                return false;
            }
        }
        return false;
    },

    // Učitavanje podataka sa dekripcijom
    loadSecureData: function(key) {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            
            const decrypted = this.decryptData(encrypted);
            if (this.validateData(decrypted)) {
                return decrypted;
            }
            return null;
        } catch (error) {
            console.error('Greška pri učitavanju:', error);
            return null;
        }
    }
};
