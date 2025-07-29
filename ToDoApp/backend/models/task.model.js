import {model, Schema} from 'mongoose';
import mongoose from 'mongoose';

const taskSchema = new Schema(
    {
        title: {
        type: String,
        minlength: [3, "Title must be at least 3 characters long!"],
        required: [true, 'Task Title is required']
        },

        description: {
        type: String,
        minlength: [5, "Description must be at least 5 characters long!"],
        required: [true, 'Description is required']
        },

        status: {
        type: String,
        enum: ['To start', 'In Progress', 'Completed'],
        default: 'To start'
        },

        dueDate: {
        type: Date,
        required: [true, 'Due date is required']
        },

        priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
        },

        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        }
    },
    { timestamps: true }

);

const Task = model("Task", taskSchema);

export default Task