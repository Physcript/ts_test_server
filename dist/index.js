"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// setting
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
// cors policies
app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin','*')
    // res.header('Access-Control-Allow-Credentials','true')
    // res.header('Access-Control-Allow-Header','Origin,X-Request-With,Content-Type,Accept,Cookie,token')
    // if(req.method === 'OPTIONS') {
    //     res.header('Access-Control-Allow-Methods' , 'GET,PUT,DELETE,PATCH,POST')
    //     res.status(201).json({})
    // }
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
// middleware
app.use((req, res, next) => {
    console.log(`METHOD: ${req.method} URL: ${req.url} IP: ${req.socket.remoteAddress}`);
    next();
});
// router
app.use('/api', user_1.default);
// datbase
mongoose_1.default
    .connect(`${config_1.default.DATABASE.URL}`, config_1.default.DATABASE.OPTIONS)
    .then(() => {
    console.log('DATABASE CONNTECTED');
})
    .catch(() => {
    console.log('NETWORK ERROR');
});
// server
httpServer
    .listen(config_1.default.SERVER.PORT, () => {
    console.log(`SERVER: ${config_1.default.SERVER.HOST} PORT: ${config_1.default.SERVER.PORT}`);
});
