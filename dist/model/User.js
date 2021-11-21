"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        trim: true,
        lowercase: true,
        requred: true
    },
    lastName: {
        type: String,
        trim: true,
        lowercase: true,
        requred: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        requred: true
    },
    password: {
        type: String,
        trim: true,
        requred: true
    },
    token: {
        type: String,
        trim: true,
    },
    verified: {
        type: String,
        trim: true,
    }
}, { timestamps: true });
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
