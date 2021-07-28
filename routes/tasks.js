const express = require("express");
const { requireAuthenticatedUser } = require("../middleware/security");
const router = express.Router();
const Task = require("../models/task");

/** Listing tasks from maintab */
router.get("/main/:id", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const maintabId = req.params.id;
        const tasks = await Task.listTasksByMain(maintabId);
        res.status(200).json({ tasks });

    } catch (error) {
        next(error);
    }
});


/** Listing tasks from subtab */
router.get("/sub/:id", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const subtabId = req.params.id;
        const tasks = await Task.listTasksBySubtab(subtabId);
        res.status(200).json({ tasks });

    } catch(error) {
        next(error);
    }
})

/** Creating a new task from maintab */
router.post("/main/create", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const task = await Task.createTaskFromMain({ main_id: req.body.main_id, task: req.body.task });
        res.status(201).json({ task });

    } catch(err) {
        next(err);
    }
});

/** Creating a new task from subtab */
router.post("/sub/create", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const task = await Task.createTaskFromSub({ sub_id: req.body.sub_id, task: req.body.task });
        res.status(201).json({ task });

    } catch(err) {
        console.log(err);
        next(err);
    }
});

/** Deleting a task */
router.delete("/:taskId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const taskId = req.params.taskId; 
        const task = await Task.deleteTask(taskId);
        res.status(201).json({ task });

    } catch(err) {
        next(err);
    }
});

/** Marking a task */
router.put("/mark/:taskId", requireAuthenticatedUser, async (req, res, next) => {
    
    try {
        const taskId = req.params.taskId;
        const task = await Task.markTask(taskId);
        res.status(201).json({ task });

    } catch(err) {
        next(err);
    }
});

/** Unmarking a subtab */
router.put("/unmark/:taskId", requireAuthenticatedUser, async (req, res, next) => {
    
    try {
        const taskId = req.params.taskId;
        const task = await Task.unmarkTask(taskId);
        res.status(201).json({ task });

    } catch(err) {
        next(err);
    }
});



module.exports = router;