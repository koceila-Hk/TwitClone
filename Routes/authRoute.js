import express from 'express';
import { verifyToken } from '../Middlewares/auth.js';
import {createUser, userSignIn, signOut} from '../Controllers/authController.js';

const router = express.Router();

router.post('/create-user', createUser);
router.post('/sign-in', userSignIn);
router.post('/sign-out', verifyToken, signOut);

export default router;