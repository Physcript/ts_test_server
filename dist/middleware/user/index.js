"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginMiddleware = exports.registerMiddleware = exports.authTokenMiddleware = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
const config_1 = __importDefault(require("../../config"));
const User_1 = __importDefault(require("../../model/User"));
const authTokenMiddleware = async (req, res, next) => {
    const cookie = req.cookies;
    const decode = jsonwebtoken_1.default.verify(cookie.token, `${config_1.default.TOKEN.LOGIN}`);
    if (!decode) {
        res.status(401).json({
            error: 'data'
        });
    }
    res.locals.user = decode;
    next();
};
exports.authTokenMiddleware = authTokenMiddleware;
const registerMiddleware = async (req, res, next) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    await CHK_EMPTY_STRING(firstName, 'Firstname', res);
    await CHK_EMPTY_STRING(lastName, 'Lastname', res);
    await CHK_EMPTY_STRING(password, 'Password', res);
    await CHK_EMPTY_STRING(confirmPassword, 'Confirm Password', res);
    await CHK_VALID_EMAIL(email, 'Email', res);
    await CHK_VALID_PASSWORD(password, confirmPassword, 'Password', res);
    next();
};
exports.registerMiddleware = registerMiddleware;
const loginMiddleware = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await CHK_USER(email, res);
    const hash = user?.password;
    await CHK_PASSWORD(password, hash, res);
    const token = await GN_LOGIN_TOKEN(user);
    user.token = token;
    await user.save();
    res.locals.user = user;
    next();
};
exports.loginMiddleware = loginMiddleware;
const GN_LOGIN_TOKEN = async (arg1) => {
    const plain = {
        _id: arg1._id,
        firstName: arg1.firstName,
        lastName: arg1.lastName,
        email: arg1.email,
        password: '',
        token: undefined,
        verified: undefined
    };
    const token = jsonwebtoken_1.default.sign(plain, `${config_1.default.TOKEN.LOGIN}`);
    return token;
};
const CHK_PASSWORD = async (arg1, arg2, res) => {
    if (!await bcrypt_1.default.compare(arg1, arg2)) {
        res.status(400).json({
            msg: `Email/Password Incorrect`
        });
    }
    return;
};
const CHK_USER = async (arg1, res) => {
    const user = await User_1.default.findOne({ email: arg1 });
    if (!user) {
        res.status(400).json({
            msg: `Email/Password Incorrect`
        });
    }
    return user;
};
const CHK_EMPTY_STRING = async (arg1, arg2, res) => {
    if (arg1.trim() !== '') {
        return;
    }
    res.status(401).json({
        msg: `Required ${arg2}`
    });
};
const CHK_VALID_EMAIL = async (arg1, arg2, res) => {
    if (!validator_1.default.isEmail(arg1)) {
        res.status(401).json({
            msg: `Required ${arg2}`
        });
    }
    if (await User_1.default.findOne({ email: arg1 })) {
        res.status(401).json({
            msg: `Email already exist`
        });
    }
    return;
};
const CHK_VALID_PASSWORD = async (arg1, arg2, arg3, res) => {
    if (arg1.trim().length < 6) {
        res.status(401).json({
            msg: 'Password minimum of 6 character'
        });
    }
    if (arg1.trim() !== arg2.trim()) {
        res.status(401).json({
            msg: 'Password not match'
        });
    }
    const encrypt = await bcrypt_1.default.hash(arg1, 8);
    res.locals.hash = encrypt;
    return;
};
