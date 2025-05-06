import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {supabase} from './modules/database.js'
import userRoute from './routes/userRoutes.js';
import todoRoute from './routes/todoRoutes.js';

const app = express();
dotenv.config();

app.use(express.json()); // Built-in body-parser for parsing JSON
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Enable Cross-Origin Resource Sharing
app.use(cookieParser()); // Enable cookie parsing

// Express Router Endpoints
app.use("/user", userRoute);
app.use("/todo", todoRoute);

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
});