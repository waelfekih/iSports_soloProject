import { Router } from "express";
import TaskController from "../controllers/task.controller.js";
import authenticateUser from '../middleware/authMiddleware.js'; 

const router = Router();


router.route('/create')
    .post(authenticateUser, TaskController.create);

router.route('/update/:id')
    .put(authenticateUser , TaskController.update);

router.route('/alltasks')
    .get(authenticateUser, TaskController.getTasks);

router.route('/:id')
    .get(authenticateUser ,TaskController.readOne);

export default router;
