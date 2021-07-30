const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Task {

    /** Fetch all tasks by maintab id  */
    static async listTasksByMain(main_id, user) {

        const query =  `
            SELECT * FROM tasks
            WHERE tasks.main_id = $1 AND tasks.user_id = (SELECT id FROM users WHERE email=$2)
            ORDER BY created_at DESC;
        `;

        const result = await db.query(query, [main_id, user.email]);

        // return tasks
        return result.rows;
    }

    /** Fetch all tasks by subtab id */
    static async listTasksBySubtab(sub_id, user) {

        const query = `
            SELECT * FROM tasks
            WHERE tasks.sub_id = $1 AND tasks.user_id = (SELECT id FROM users WHERE email=$2)
            ORDER BY created_at DESC;
        `

        const result = await db.query(query, [sub_id, user.email]);

        // return tasks
        return result.rows;
    }

    /** Creating a task from maintab */
    static async createTaskFromMain({ user, main_id, task }) {

        const requiredFields = ["details"];
        requiredFields.forEach((field) => {
            if (!task.hasOwnProperty(field) || !task[field]) {
                throw new BadRequestError(
                    `Required field - ${field} - missing from request body.`
                );
            }
        });

        const query = `
            INSERT INTO tasks (user_id, main_id, details, priority, date)
            VALUES ((SELECT id FROM users WHERE email=$1), $2, $3, $4, $5)
            RETURNING id, user_id, main_id, details, priority, date, completed, created_at;
        `;

        const result = await db.query(query, [user.email, main_id, task.details, task.priority, task.date]);

        // return new task
        return result.rows[0];
    }

    /** Creating a task from subtab */
    static async createTaskFromSub({ user, sub_id, task }) {

        const requiredFields = ["details"];
        requiredFields.forEach((field) => {
            if (!task.hasOwnProperty(field) || !task[field]) {
                throw new BadRequestError(
                    `Required field - ${field} - missing from request body.`
                );
            }
        });

        const query = `
            INSERT INTO tasks (user_id, sub_id, details, priority, date)
            VALUES ((SELECT id FROM users WHERE email=$1), $2, $3, $4, $5)
            RETURNING id, user_id, sub_id, details, priority, date, completed, created_at;
        `;

        const result = await db.query(query, [user.email, sub_id, task.details, task.priority, task.date]);

        // return new task
        return result.rows[0];
    }

    /** Deleting a task  */
    static async deleteTask(taskId, user) {
        const query = `
            DELETE FROM tasks
            WHERE tasks.id = $1 AND tasks.user_id = (SELECT id FROM users WHERE email=$2);
        `;

        const result = await db.query(query, [taskId, user.email]);

        return result.rows[0];
    }

    /** Updating task details */
    static async updateTask({taskId, updatedTask, user}) {

        let query;
        let result;

        if (!updatedTask?.details) { //if name is empty, it will only update the others

            query = `
                UPDATE tasks
                SET priority = $1, date = $2, updated_at = NOW()
                WHERE tasks.id = $3 AND tasks.user_id = (SELECT id FROM users WHERE email=$4)
                RETURNING id, user_id, main_id, sub_id, details, priority, date, created_at, updated_at; 
            `
            result = await db.query(query, [updatedTask.priority, updatedTask.date, taskId, user.email]);

        } else {

            query = `
                UPDATE tasks
                SET details = $1, priority = $2, date = $3, updated_at = NOW()
                WHERE tasks.id = $4 AND tasks.user_id = (SELECT id FROM users WHERE email=$5)
                RETURNING id, user_id, main_id, sub_id, details, priority, date, created_at, updated_at; 
            `

            result = await db.query(query, [updatedTask.details, updatedTask.priority, updatedTask.date, taskId, user.email]);
        }

        return result.rows[0];
    }

    /** Mark task */
    static async markTask(taskId, user) {
        const query = `
            UPDATE tasks
            SET completed = TRUE, completed_at = NOW()
            WHERE tasks.id = $1 AND tasks.user_id = (SELECT id FROM users WHERE email=$2);
        `

        const result = await db.query(query, [taskId, user.email]);

        // return task
        return result.rows[0];
    }

    /** Unmark task */
    static async unmarkTask(taskId, user) {
        const query = `
            UPDATE tasks
            SET completed = FALSE
            WHERE tasks.id = $1 AND tasks.user_id = (SELECT id FROM users WHERE email=$2);
        `

        const result = await db.query(query, [taskId, user.email]);

        // return task
        return result.rows[0];
    }

    // /** Deleting completed tasks  */
    // static async deleteCompletedTasks() {
    //     const query = `
    //             DELETE FROM tasks
    //             WHERE completed = TRUE;
    //         `;

    //     const result = await db.query(query);

    //     return result.rows[0];
    // }
}

module.exports = Task;