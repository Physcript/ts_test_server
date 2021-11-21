"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../../model/User"));
const register = async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const password = res.locals.hash;
    const user = new User_1.default({
        firstName,
        lastName,
        email,
        password
    });
    await user.save();
    res.status(201).json({
        msg: 'Account created',
        data: user
    });
};
exports.register = register;
const login = async (req, res) => {
    const data = res.locals.user;
    res.status(201).json({
        data
    });
};
exports.login = login;
const authenticate = async (req, res) => {
    const data = res.locals.user;
    const user = {
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
    };
    console.log(user);
    res.status(201).json({
        data: user
    });
};
exports.authenticate = authenticate;
