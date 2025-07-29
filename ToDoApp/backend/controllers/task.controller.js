import Task from "../models/task.model.js"


const TaskController = {

    //create
    create: async (req, res) => {
    try {
        const taskData = {
        ...req.body,
        user: req.user.id, 
        };
        const newTask = await Task.create(taskData);
        res.json(newTask);
        } catch (error) {
        console.log(error);
        res.status(400).json(error); 
        }
    },


    // read all
    readAll : async(req ,res) => {
        try {
            const AllTasks = await Task.find();
            res.json(AllTasks)
        } 
        catch (error) {
            console.log(error)
            res.json(error)
        }
    },

    // Get all tasks for a specific user
    getTasks : async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }); 
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    },

    // read by one
    readOne : async(req,res) => {
        try {
            const getOneTask = await Task.findById(req.params.id);
            res.json(getOneTask)
        }
        catch (error) {
            console.log(error)
            res.json(error)
        }
    },

    // Edit a task
    update : async(req , res) => {
        const options = {
            new: true,
            runValidators: true
        }
        try {
            const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, options);
            res.json(updatedTask);
        } catch (error) {
            console.log(error);
            res.json(error);
        }
    }
}

export default TaskController;