



import mongoose from 'mongoose';

import { IUserProps } from '../interface/user';

const userSchema = new mongoose.Schema<IUserProps>({

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

}, { timestamps: true })

const User = mongoose.model('User',userSchema)
export default User
