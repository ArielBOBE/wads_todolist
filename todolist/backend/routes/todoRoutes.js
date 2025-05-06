import express from 'express';
import {signUp, signIn} from '../controllers/user.js';
import {auth, issueToken} from '../middleware/auth.js';
import { addTask, deleteTask, editTask, getTask } from '../controllers/todo.js';
import cookieParser from 'cookie-parser';

const router = express.Router();

// router.use(auth, issueToken);

router.get("/get", auth, issueToken, getTask);

router.post("/add", auth, issueToken, addTask);

router.patch("/edit/:id", auth, issueToken, editTask);

router.delete("/delete/:id", auth, issueToken, deleteTask);

export default router;