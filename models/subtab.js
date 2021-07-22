const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Subtab {

    /** Fetch all subtabs by maintab id */
    static async listSubtabsByMain(main_id) {

        const query = `
            SELECT * FROM subtabs
            WHERE subtabs.main_id = $1
            ORDER BY name ASC;
        `
    
        const result = await db.query(query, [main_id]);
    
        // return subtabs 
        return result.rows;
    }
    
    /* Fetch all subtabs by subtab id */
    static async listSubtabsBySubtab(sub_id) {

        const query =  `
            SELECT * FROM subtabs
            WHERE subtabs.sub_id = $1
            ORDER BY name DESC;
        `

        const result = await db.query(query, [sub_id]);

        // return subtabs
        return result.rows;
    }  

    /** Creating a subtab from maintab */
    static async createSubtabFromMain({ main_id, subtab }) {
        const requiredFields = ["name"];
        requiredFields.forEach((field) => {
            if (!subtab.hasOwnProperty(field) || !subtab[field]) {
                throw new BadRequestError(`Required field - ${field} - missing from request body.`)
            }
        });

        const query = `
            INSERT INTO subtabs (main_id, name)
            VALUES ($1, $2)
            RETURNING id, main_id, name, created_at;
        `

        const result = await db.query(query, [main_id, subtab.name]);

        // return new subtab
        return result.rows[0];
    }

    /** Creating a subtab from subtab */
    static async createSubtabFromSub({ sub_id, subtab }) {
        const requiredFields = ["name"];
        requiredFields.forEach((field) => {
            if (!subtab.hasOwnProperty(field) || !subtab[field]) {
                throw new BadRequestError(`Required field - ${field} - missing from request body.`)
            }
        });

        const query = `
            INSERT INTO subtabs (sub_id, name)
            VALUES ($1, $2)
            RETURNING id, sub_id, name, created_at;
        `

        const result = await db.query(query, [sub_id, subtab.name]);

        // return new subtab
        return result.rows[0];
    }

    /** Deleting a subtab  */
    static async deleteSubtab(id) {
        
        const query = `
            DELETE FROM subtabs
            WHERE subtabs.id = $1;
        `

        const result = await db.query(query, [id]);

        return result.rows;
    }

    /** Return object containing directory tree data */
    static async getDirectoryData(maintabId, user) {
        
        const query = `
            SELECT * FROM main_tabs
            WHERE main_tabs.id = $1 AND main_tabs.user_id = (SELECT id FROM users WHERE email=$2);
        `
        const result = await db.query(query, [maintabId, user.email]);
        const maintab = result.rows[0];
        const primarySubtabs = await this.listSubtabsByMain(maintabId);


        const children = await Promise.all(
            primarySubtabs.map(async (element) => ({
                id: element.id,
                name: element.name,
                children: await (this.getChildren(element.id))
            }))
        ) 

        let data = {
            id: 'root',
            name: maintab.name,
            children: children
        }

        console.log(data);

        return data;
    }

    // Recursivaly returns an array of all children subtabs associated to the subtabId
    static async getChildren(subtabId) {

        const subtabs = await (this.listSubtabsBySubtab(subtabId))
        if (!subtabs.length) {
            return;
        }

        const children = await Promise.all(

            subtabs.map(async (element) => ({
                id: element.id,
                name: element.name,
                children: await (this.getChildren(element.id, currentId))
            }))
        )

        return children;

    }
}

module.exports = Subtab;