

import express from 'express';

import { authenticate, login, register } from '../controller/user';
import {
	authTokenMiddleware,
	loginMiddleware,
	registerMiddleware,
} from '../middleware/user';

const router = express.Router()

router.post('/register',registerMiddleware,register)
router.post('/login',loginMiddleware,login)
router.post('/auth',authTokenMiddleware,authenticate)

export default router
