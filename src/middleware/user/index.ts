import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import config from '../../config';
import { IUserProps } from '../../interface/user';
import User from '../../model/User';

export const authTokenMiddleware = async (req:Request,res:Response,next:NextFunction) => {
    const cookie = req.cookies
    const decode = jwt.verify(cookie.token, `${config.TOKEN.LOGIN}`)
    if(!decode) {
        res.status(401).json({
            error: 'data'
        })
    }
    res.locals.user = decode

    next()
}

export const registerMiddleware = async (req: Request,res: Response,next: NextFunction) => {
    const { firstName,lastName,email,password,confirmPassword } = req.body
    await CHK_EMPTY_STRING(firstName,'Firstname', res)
    await CHK_EMPTY_STRING(lastName,'Lastname', res)
    await CHK_EMPTY_STRING(password,'Password', res)
    await CHK_EMPTY_STRING(confirmPassword,'Confirm Password', res)
    await CHK_VALID_EMAIL(email,'Email', res)
    await CHK_VALID_PASSWORD(password,confirmPassword,'Password', res)
    next()
}

export const loginMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { email,password } = req.body
    const user = await CHK_USER(email,res)
    const hash = user?.password!
    await CHK_PASSWORD(password,hash,res)
    const token = await GN_LOGIN_TOKEN(user!)
    user!.token = token
    await user!.save()
    res.locals.user = user!
    next()
}

const GN_LOGIN_TOKEN = async (arg1: IUserProps) => {
    const plain: IUserProps = {
        _id: arg1._id,
        firstName: arg1.firstName,
        lastName: arg1.lastName,
        email: arg1.email,
        password: '',
        token: undefined,
        verified: undefined
    }
    const token = jwt.sign(plain,`${config.TOKEN.LOGIN}`)

    return token
}

const CHK_PASSWORD = async(arg1: string, arg2: string, res: Response) => {

    if(! await bcrypt.compare(arg1,arg2)) {
        res.status(400).json({
            msg: `Email/Password Incorrect`
        })
    }
    return
}

const CHK_USER = async(arg1: string, res: Response) => {
    const user = await User.findOne({email:arg1})
    if(!user){
        res.status(400).json({
            msg: `Email/Password Incorrect`
        })
    }

    return user
}

const CHK_EMPTY_STRING  = async (arg1: string, arg2: string, res: Response) => {
    if(arg1.trim() !== '') {
        return
    }

    res.status(401).json({
        msg: `Required ${arg2}`
    })
}

const CHK_VALID_EMAIL = async (arg1: string, arg2: string, res: Response) => {
    if(!validator.isEmail(arg1)){
        res.status(401).json({
            msg: `Required ${arg2}`
        })
    }

    if(await User.findOne({email:arg1})){
        res.status(401).json({
            msg: `Email already exist`
        })
    }


    return
}

const CHK_VALID_PASSWORD = async (arg1: string, arg2: string, arg3: string, res: Response) => {
    if(arg1.trim().length < 6) {
        res.status(401).json({
            msg: 'Password minimum of 6 character'
        })
    }

    if(arg1.trim() !== arg2.trim()){
        res.status(401).json({
            msg: 'Password not match'
        })
    }

    const encrypt = await bcrypt.hash(arg1,8)
    res.locals.hash = encrypt

    return

}
