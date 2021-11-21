


require('dotenv').config()
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';

import config from './config';
import userRoute from './routes/user';

const app = express()
const httpServer = createServer(app)


// setting
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())


// cors policies
app.use((req,res,next) => {

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
    next()
})

// middleware
app.use((req,res,next) => {
    console.log(`METHOD: ${req.method} URL: ${req.url} IP: ${req.socket.remoteAddress}`)
    next()
})

// router

app.use('/api', userRoute)

// datbase

mongoose
    .connect(`${config.DATABASE.URL}`,config.DATABASE.OPTIONS)
    .then(() => {
        console.log('DATABASE CONNTECTED')
    })
    .catch(() => {
        console.log('NETWORK ERROR')
    })

// server

httpServer
    .listen(config.SERVER.PORT, () => {
        console.log(`SERVER: ${config.SERVER.HOST} PORT: ${config.SERVER.PORT}`)
    })
