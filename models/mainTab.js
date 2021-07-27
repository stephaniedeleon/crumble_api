const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class MainTab {

    /** Fetch all maintabs */
    static async listMaintabsForUser(user) {

        const query = `
            SELECT * FROM main_tabs
            WHERE main_tabs.user_id = (SELECT id FROM users WHERE email=$1)
            ORDER BY id DESC;
        `
        const result = await db.query(query, [user.email]);

        //return maintabs
        return result.rows;
    }

    /** Fetch maintab by id */
    static async fetchMaintabById(maintabId, user) {

        const query = `
            SELECT * FROM main_tabs
            WHERE main_tabs.id = $1 AND main_tabs.user_id = (SELECT id FROM users WHERE email=$2);
        `
        const result = await db.query(query, [maintabId, user.email]);

        //return maintab
        return result.rows[0];
    }

    /** Creating a new maintab */
    static async createMaintab({ user, maintab }) {

        const requiredFields = ["name"];
            requiredFields.forEach((field) => {
            if (!maintab.hasOwnProperty(field) || !maintab[field]) {
                throw new BadRequestError(`Required field - ${field} - missing from request body.`)
            }
        });

        //create a new maintab - store in database
        const query = `
            INSERT INTO main_tabs (user_id, name)
            VALUES ((SELECT id FROM users WHERE email=$1), $2) 
            RETURNING id, user_id, name, created_at;            
        `
        const result = await db.query(query, [user.email, maintab.name]);

        //return new maintab
        return result.rows[0];
    }


    /** Deleting a new maintab */
    static async deleteMaintab(maintabId, user) {

        const query = `
            DELETE FROM main_tabs
            WHERE main_tabs.id = $1 AND main_tabs.user_id = (SELECT id FROM users WHERE email=$2);
        `
        const result = await db.query(query, [maintabId, user.email]);

        return result.rows;
    }

    /** Updating a maintab name */
    static async updateMaintab({maintabId, newName, user}) {

            const query = `
            UPDATE main_tabs
            SET name = $1, updated_at = NOW()
            WHERE main_tabs.id = $2 AND main_tabs.user_id = (SELECT id FROM users WHERE email=$3)
            RETURNING id, user_id, name, created_at, updated_at; 
        `
        const result = await db.query(query, [newName, maintabId, user.email]);

        return result.rows;
    }

}

module.exports = MainTab;