const CryptoJS = require("crypto-js");
const md5 = require("md5");
const key = CryptoJS.SHA256(process.env.ENC_KEY);
const iv = CryptoJS.enc.Base64.parse("");
const jwt = require("jsonwebtoken");

module.exports = {
    encrypt: (dataToEncrypt) => {
        const data =
            typeof dataToEncrypt === "string"
                ? dataToEncrypt
                : JSON.stringify(dataToEncrypt);

        return CryptoJS.AES.encrypt(data, key, {
            keySize: 32,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }).toString();
    },

    decrypt: (encryptString) => {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptString, key, {
                keySize: 32,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });

            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    generateSalt: (length) => {
        var char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var password = "";

        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * char.length);
            password += char.charAt(randomIndex);
        }

        return password;
    },

    hashPassword: (password, salt) => {
        const hashedPassword = md5(password + salt);
        return hashedPassword;
    },

    generateToken: (payload) => {
        const token = jwt.sign(
            payload,
            process.env.APP_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_LIFE, }
        );
        return token;
    },

    decodeToken: (token) => {
        const decoded = jwt.verify(token, process.env.APP_ACCESS_TOKEN_SECRET);
        return decoded;
    },

    // kWDvVnAW84hy4mzxrXlnIpQ9A10 genrate string like this for session id and store in db
    generateSessionId: () => {
        return md5(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }

};
