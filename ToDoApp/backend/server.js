import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dbConnect from './config/todo.config.js';
import router from './routes/user.route.js';
import trouter from './routes/task.route.js';

dotenv.config();
const app = express();

//dotenv.config();

app.use(express.json(), cors());


const PORT = process.env.PORT;
dbConnect();



app.use("/api" , router)
app.use('/api/tasks', trouter);

app.listen(PORT, () =>
    console.log(`Listening on port: ${PORT}`)
);