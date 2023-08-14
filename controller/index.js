const APIResponseFormat = require('../utils/APIResponseFormat');
const { encrypt, decrypt, generateSalt, hashPassword, generateToken, generateSessionId, decodeToken, generateVerificationCode } = require("../utils/helper");
const db = require('../db/models/index');
const { Op } = require('sequelize');
const service = require('../services/index');
const { sendMail } = require('../core/nodemailer');
const e = require('express');

// allowed origin app name mapping with url (serviceUrl)
const allowedOrigin = {
    "http://localhost:3000": true,
    "http://localhost:3001": true,
};

const getLoginPage = async (req, res) => {
    try {
        const { serviceUrl } = req.query;

        const loginProps = {
            serviceUrl: serviceUrl,
            error: "",
        };

        // check serviceUrl is passed or not in query string
        if (!serviceUrl) {
            return res.render('error', { error: "Service url is required" });
            // return APIResponseFormat._ResMissingRequiredField(res, "Service url is required");
        }

        // check serviceUrl is valid or not (allowed origin) with URL mapping
        const serviceUrlOrigin = new URL(serviceUrl).origin;
        if (!allowedOrigin[serviceUrlOrigin]) {
            return res.render('error', { error: "You are not authorized to access this service" });
            // return APIResponseFormat._ResDataNotFound(res, "You are not authorized to access this page");
        }

        if (req.cookies.sessionId) {
            const ss = await db.sso_sessions.findOne({
                where: {
                    sessionId: req.cookies.sessionId
                }
            })
            if (!ss) {
                return res.render('error', { error: "Session not exists" });
                // return APIResponseFormat._ResDataNotFound(res, "Session not exists");
            }
            // redirect to serviceUrl with token
            return res.redirect(`${serviceUrl}?token=${ss.token}`);
        }

        // get birthday list from database (if any)
        const birthdayList = await service.getBirthday();
        if (birthdayList.length > 0) {
            loginProps.birthdayList = birthdayList;
        } else {
            loginProps.birthdayList = [];
        }

        // render login page
        return res.render('login', { loginProps: loginProps });
    }
    catch (error) {
        return res.render('error', { error: error });
        // return APIResponseFormat._ResServerError(res, error);
    }
}

const login = async (req, res) => {
    try {
        let { username, password, serviceUrl } = req.body;

        const loginProps = {
            serviceUrl: serviceUrl,
            error: "",
        };

        // get birthday list from database (if any)
        const birthdayList = await service.getBirthday();
        if (birthdayList.length > 0) {
            loginProps.birthdayList = birthdayList;
        } else {
            loginProps.birthdayList = [];
        }

        if (!username || !password) {
            loginProps.error = "Username and password are required";
            return res.render('login', { loginProps: loginProps });
            // return APIResponseFormat._ResMissingRequiredField(res, "Username and password are required");
        }

        const employee = await db.sso_employees.findOne({
            where: {
                employeeCode: username
            }
        })
        if (!employee) {
            loginProps.error = "Employee does not exists";
            return res.render('login', { loginProps: loginProps });
            // return APIResponseFormat._ResDataNotFound(res, "Employee not exists");
        }

        const decryptedSalt = decrypt(employee.salt);
        const hashedPassword = hashPassword(password, decryptedSalt);

        if (hashedPassword !== employee.password) {
            loginProps.error = "Invalid credentials";
            return res.render('login', { loginProps: loginProps });
            // return APIResponseFormat._ResDataNotFound(res, "Invalid username or password");
        }

        const token = generateToken({
            firstName: employee.firstName,
            lastName: employee.lastName,
            employeeId: employee.employeeId,
            employeeCode: employee.employeeCode,
            designationId: employee.designationId,
            roleId: employee.roleId,
            dateOfBirth: employee.dateOfBirth,
            employeeImage: employee.employeeImage,
        });

        const sessionId = generateSessionId();

        // console.log("---------- sessionId: ", sessionId);
        // console.log("---------- token: ", token);

        const result = await db.sso_sessions.create({
            sessionId: sessionId,
            token: token,
            sourceUrl: serviceUrl,
        })
        if (!result) {
            return res.render('error', { error: "Login failed" });
            // return APIResponseFormat._ResDataNotFound(res, "Login failed");
        }

        // set sessionID in cookie
        res.cookie('sessionId', sessionId);

        return res.redirect(`${serviceUrl}?token=${token}`);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const validateToken = async (req, res) => {
    try {
        // get the parameters from header
        const { session_id, token } = req.headers;

        // check session_id and token is passed or not
        if (!session_id || !token) {
            return APIResponseFormat._ResMissingRequiredField(res, "Required fields are missing");
        }

        // check session_id is valid or not (exists in database)
        const session = await db.sso_sessions.findOne({
            where: {
                sessionId: session_id
            }
        })
        if (!session) {
            return APIResponseFormat._ResDataNotFound(res, "Session not exists");
        }

        // decode token
        const decodedToken = decodeToken(token);
        if (!decodedToken) {
            return APIResponseFormat._ResDataNotFound(res, "Invalid token");
        }

        // decode the database token
        const decodedDbToken = decodeToken(session.token);
        if (!decodedDbToken) {
            return APIResponseFormat._ResDataNotFound(res, "Invalid token");
        }

        // check both are same or not
        if (decodedToken.employeeId !== decodedDbToken.employeeId) {
            return APIResponseFormat._ResDataNotFound(res, "Invalid token");
        }

        // check token is expired or not
        const currentTime = Math.floor(Date.now() / 1000);
        const tokenExpTime = decodedToken.exp;
        if (currentTime > tokenExpTime) {
            return APIResponseFormat._ResDataNotFound(res, "Token expired");
        }

        // send the response with decoded token
        return APIResponseFormat._ResDataFound(res, "Session validated successfully", {
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            employeeId: decodedToken.employeeId,
            employeeCode: decodedToken.employeeCode,
            designationId: decodedToken.designationId,
            roleId: decodedToken.roleId,
            dateOfBirth: decodedToken.dateOfBirth,
            employeeImage: decodedToken.employeeImage,
        });
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return APIResponseFormat._ResError(res, "Token expired");
        } else if (error.name === "JsonWebTokenError") {
            return APIResponseFormat._ResError(res, "Invalid token");
        } else {
            return APIResponseFormat._ResServerError(res, error);
        }
    }
}

const getForgotPasswordPage = async (req, res) => {
    try {
        return res.render('forgot-password')
    } catch (error) {
        return res.render('error');
    }
}

const forgotPassword = async (req, res) => {
    try {
        let { email } = req.body;
        if (!email) {
            return APIResponseFormat._ResMissingRequiredField(res, "Email is required");
        }

        // check email exists or not
        const existEmail = await db.sso_employees.findOne({
            where: {
                employeeEmail: encrypt(email)
            }
        })
        if (!existEmail) {
            return APIResponseFormat._ResError(res, "Email does not exists");
        }

        // generate verification code
        const verificationCode = generateVerificationCode();

        // save verification code in database
        await db.sso_employees.update({
            verificationCode: encrypt(verificationCode),
            verificationExpiry: Date.now() + 5 * 60 * 1000 // 5 minutes expiry
        }, {
            where: {
                employeeEmail: encrypt(email)
            }
        })

        APIResponseFormat._ResDataFound(res, "Verification code sent successfully", {
            verificationCode: verificationCode
        })

        // send email
        const mailContent = {
            to: email,
            subject: "Forgot password",
            body: `<p>Verification code: <b>${verificationCode}</b></p>`
        }
        await sendMail(mailContent);

    } catch (error) {
        return res.render('error');
    }
}

const verifyVerificationCode = async (req, res) => {
    try {
        let { email, verificationCode } = req.body;
        if (!email) {
            return APIResponseFormat._ResMissingRequiredField(res, "Email is required");
        }
        if (!verificationCode) {
            return APIResponseFormat._ResMissingRequiredField(res, "Verification code is required");
        }

        email = encrypt(email);
        verificationCode = encrypt(verificationCode);

        // verify the verification code and expiry time
        const isVerified = await db.sso_employees.findOne({
            where: {
                employeeEmail: email,
                verificationCode: verificationCode,
                verificationExpiry: {
                    [Op.gte]: Date.now()
                }
            }
        })

        if (!isVerified) {
            return APIResponseFormat._ResError(res, "Invalid verification code");
        }

        return APIResponseFormat._ResDataFound(res, "Verification code verified successfully", {
            email: email.replace(/\+/g, '-').replace(/\//g, '_'),
        })

    } catch (error) {
        return res.render('error');
    }
}

const getResetPasswordPage = async (req, res) => {
    try {
        return res.render('reset-password')
    } catch (error) {
        return res.render('error');
    }
}

const setPassword = async (req, res) => {
    try {
        let { email, password } = req.body;

        // encryptedCandidateId.replace(/\+/g, '-').replace(/\//g, '_'); // replace - with + and _ with /
        email = email.replace(/-/g, '+').replace(/_/g, '/');

        if (!email || !password) {
            return APIResponseFormat._ResMissingRequiredField(res, "Required fields are missing");
        }

        // if check username exists or not
        const user = await db.sso_employees.findOne({
            where: {
                employeeEmail: email
            }
        })
        if (!user) {
            return APIResponseFormat._ResError(res, "Invalid email");
        }

        const salt = generateSalt(10);
        const hashedPassword = hashPassword(password, salt);

        // update password
        const result = await db.sso_employees.update({
            password: hashedPassword,
            salt: encrypt(salt)
        }, {
            where: {
                employeeEmail: email
            }
        })
        if (!result) {
            return APIResponseFormat._ResDataNotUpdated(res, "Password not updated");
        }
        return APIResponseFormat._ResDataUpdated(res, "Password updated successfully");
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

module.exports = {
    setPassword,
    getLoginPage,
    login,
    validateToken,
    getForgotPasswordPage,
    forgotPassword,
    verifyVerificationCode,
    getResetPasswordPage
}