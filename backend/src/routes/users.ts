import { Router } from "express";
import * as UserController from '../controllers/users'
import { requireAuth } from "../middlewares/auth";

const router = Router()

router.get('/', requireAuth, UserController.getCurrentAuthenticatedUser)

router.post('/signUp', UserController.signUp)

router.post('/signIn', UserController.signIn)

router.post('/signOut', UserController.signOut)

export default router