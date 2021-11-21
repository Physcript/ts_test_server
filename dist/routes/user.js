"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const user_2 = require("../middleware/user");
const router = express_1.default.Router();
router.post('/register', user_2.registerMiddleware, user_1.register);
router.post('/login', user_2.loginMiddleware, user_1.login);
router.post('/auth', user_2.authTokenMiddleware, user_1.authenticate);
exports.default = router;
