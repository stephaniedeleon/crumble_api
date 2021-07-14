const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Subtab {

    /* Fetch all subtabs */
    static async listSubtabsForParent(id) {

        const query =  `
            SELECT * from subtabs
            
        `
    }  
}

module.exports = Subtab;