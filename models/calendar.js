const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Calendar {

    /** Fetch all events for maintab */
    static async listEventsForMaintab(main_id) {

        const query = `
            SELECT * FROM calendar
            WHERE calendar.main_id = $1
            ORDER BY created_at DESC;
        `
        const result = await db.query(query, [main_id]);

        //return events
        return result.rows;
    }

    /** Fetch all events for subtab */
    static async listEventsForSubtab(sub_id) {

        const query = `
        SELECT * FROM calendar
        WHERE calendar.sub_id = $1
        ORDER BY created_at DESC;
        `
        const result = await db.query(query, [sub_id]);

        //return events
        return result.rows;
    }

    /** Creating a new event for maintab */
    static async createEventForMaintab({ main_id, event }) {

        const requiredFields = ["event_name", "date"];
        requiredFields.forEach((field) => {
            if (!event.hasOwnProperty(field) || !event[field]) {
                throw new BadRequestError(`Required field - ${field} - missing from request body.`)
            }
        });

        //create a new maintab - store in database
        const query = `
            INSERT INTO calendar (main_id, event_name, date)
            VALUES ($1, $2, $3) 
            RETURNING id, main_id, sub_id, event_name, date, created_at;            
        `
        const result = await db.query(query, [main_id, event.event_name, event.date]);

        //return new event
        return result.rows[0];
    }

    /** Creating a new event for subtab */
    static async createEventForSubtab({ sub_id, event }) {

        const requiredFields = ["event_name", "date"];
        requiredFields.forEach((field) => {
            if (!event.hasOwnProperty(field) || !event[field]) {
                throw new BadRequestError(`Required field - ${field} - missing from request body.`)
            }
        });

        //create a new maintab - store in database
        const query = `
            INSERT INTO calendar (sub_id, event_name, date)
            VALUES ($1, $2, $3) 
            RETURNING id, main_id, sub_id, event_name, date, created_at;            
        `
        const result = await db.query(query, [sub_id, event.event_name, event.date]);

        //return new event
        return result.rows[0];
    }

    /** Deleting an event */
    static async deleteEvent(event_id) {
        const query = `
                DELETE FROM calendar
                WHERE calendar.id = $1;
            `;

        const result = await db.query(query, [event_id]);

        return result.rows;
    }

}

module.exports = Calendar;

// CREATE TABLE calendar (
//     id              SERIAL PRIMARY KEY,
//     main_id         INTEGER DEFAULT NULL,
//     sub_id          INTEGER DEFAULT NULL,
//     event_name      VARCHAR(20) NOT NULL,
//     date            TIMESTAMP NOT NULL,
//     created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
//     FOREIGN KEY     (main_id) REFERENCES main_tabs(id) ON DELETE CASCADE,
//     FOREIGN KEY     (sub_id) REFERENCES subtabs(id) ON DELETE CASCADE
// );