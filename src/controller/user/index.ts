
import { Request, Response } from 'express';

import User from '../../model/User';

export const register = async (req: Request,res: Response) => {

    const { firstName,lastName,email } = req.body
    const password = res.locals.hash
    const user = new User({
        firstName,
        lastName,
        email,
        password
    })
    await user.save()

    res.status(201).json({
        msg: 'Account created',
        data: user
    })
}

export const login = async (req:Request,res:Response) => {
    const data = res.locals.user
    res.status(201).json({
        data
    })
}

export const authenticate = async (req: Request, res: Response) => {
    const data = res.locals.user

    const user = {
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
    }

    res.status(201).json({
        data: user
    })
}
