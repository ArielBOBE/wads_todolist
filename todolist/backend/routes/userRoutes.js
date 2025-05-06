import express from 'express';
import {signUp, signIn, signOut} from '../controllers/user.js';
import {auth, issueToken, confirm} from '../middleware/auth.js';
import cookieParser from 'cookie-parser';

const router = express.Router();

router.post("/signup", signUp);

router.get("/signin", auth, issueToken, confirm)

router.post("/signin", signIn);

router.get("/logout", signOut);

export default router;

