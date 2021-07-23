const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Task {
    /** Fetch all tasks by maintab id  */
    static async listTasksByMain(main_id) {
        const query =  `
            SELECT * FROM tasks
            WHERE tasks.main_id = $1
            ORDER BY created_at DESC;
        `;

        const result = await db.query(query, [main_id]);

        // return tasks
        return result.rows;
    }

    /** Fetch all tasks by subtab id */
    static async listTasksBySubtab(sub_id) {
        const query = `
            SELECT * FROM tasks
            WHERE tasks.sub_id = $1
            ORDER BY created_at DESC;
        `

        const result = await db.query(query, [sub_id]);

        // return tasks
        return result.rows;
    }

    /** Creating a task from maintab */
    static async createTaskFromMain({ main_id, task }) {
        const requiredFields = ["details"];
        requiredFields.forEach((field) => {
            if (!task.hasOwnProperty(field) || !task[field]) {
                throw new BadRequestError(
                    `Required field - ${field} - missing from request body.`
                );
            }
        });

        const query = `
                INSERT INTO tasks (main_id, details)
                VALUES ($1, $2)
                RETURNING id, main_id, details, completed, created_at;
            `;

        const result = await db.query(query, [main_id, task.details]);

        // return new task
        return result.rows[0];
    }

    /** Creating a task from subtab */
    static async createTaskFromSub({ sub_id, task }) {
        const requiredFields = ["details"];
        requiredFields.forEach((field) => {
            if (!task.hasOwnProperty(field) || !task[field]) {
                throw new BadRequestError(
                `Required field - ${field} - missing from request body.`
                );
            }
        });

        const query = `
                INSERT INTO tasks (sub_id, details)
                VALUES ($1, $2)
                RETURNING id, sub_id, details, completed, created_at;
            `;

        const result = await db.query(query, [sub_id, task.details]);

        // return new task
        return result.rows[0];
    }

    /** Deleting a task  */
    static async deleteTask(id) {
        const query = `
                DELETE FROM tasks
                WHERE tasks.id = $1;
            `;

        const result = await db.query(query, [id]);

        return result.rows;
    }

    /** Mark task */
    static async markTask(id) {
        const query = `
            UPDATE tasks
            SET completed = TRUE
            WHERE id = $1
        `

        const result = await db.query(query, [id]);

        // return task
        return result.rows[0];
    }

    /** Unmark task */
    static async unmarkTask(id) {
        const query = `
            UPDATE tasks
            SET completed = FALSE
            WHERE id = $1
        `

        const result = await db.query(query, [id]);

        // return task
        return result.rows[0];
    }
}

module.exports = Task;