const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Calendar {

    /** Fetch all events for maintab */
    static async listEventsForMaintab(main_id, user) {

        const query = `
            SELECT * FROM calendar
            WHERE calendar.main_id = $1 AND calendar.user_id = (SELECT id FROM users WHERE email=$2)
            ORDER BY date ASC;
        `
        const result = await db.query(query, [main_id, user.email]);

        //return events
        return result.rows;
    }

    /** Fetch all events for subtab */
    static async listEventsForSubtab(sub_id, user) {

        const query = `
        SELECT * FROM calendar
        WHERE calendar.sub_id = $1 AND calendar.user_id = (SELECT id FROM users WHERE email=$2)
        ORDER BY date ASC;
        `
        const result = await db.query(query, [sub_id, user.email]);

        //return events
        return result.rows;
    }

    /** Creating a new event for maintab */
    static async createEventForMaintab({ user, main_id, event }) {

        const requiredFields = ["event_name", "date"];
        requiredFields.forEach((field) => {
            if (!event.hasOwnProperty(field) || !event[field]) {
                throw new BadRequestError(`Required field - ${field} - missing from request body.`)
            }
        });

        //create a new event - store in database
        const query = `
            INSERT INTO calendar (user_id, main_id, event_name, date)
            VALUES ((SELECT id FROM users WHERE email=$1), $2, $3, $4) 
            RETURNING *;            
        `
        const result = await db.query(query, [user.email, main_id, event.event_name, event.date]);

        //return new event
        return result.rows[0];
    }

    /** Creating a new event for subtab */
    static async createEventForSubtab({ user, sub_id, event }) {

        const requiredFields = ["event_name", "date"];
        requiredFields.forEach((field) => {
            if (!event.hasOwnProperty(field) || !event[field]) {
                throw new BadRequestError(`Required field - ${field} - missing from request body.`)
            }
        });

        //create a new event - store in database
        const query = `
            INSERT INTO calendar (user_id, sub_id, event_name, date)
            VALUES ((SELECT id FROM users WHERE email=$1), $2, $3, $4) 
            RETURNING *;            
        `
        const result = await db.query(query, [user.email, sub_id, event.event_name, event.date]);

        //return new event
        return result.rows[0];
    }

    /** Deleting an event */
    static async deleteEvent(event_id, user) {
        const query = `
            DELETE FROM calendar
            WHERE calendar.id = $1 AND calendar.user_id = (SELECT id FROM users WHERE email=$2);
        `;

        const result = await db.query(query, [event_id, user.email]);

        return result.rows[0];
    }

    /** Updating an event */
    static async updateEvent({eventId, updatedEvent, user}) {

        let query;
        let result;

        if (updatedEvent?.event_name && updatedEvent?.date) { //runs if they edited both

            query = `
                UPDATE calendar
                SET event_name = $1, date = $2, updated_at = NOW()
                WHERE calendar.id = $3 AND calendar.user_id = (SELECT id FROM users WHERE email=$4)
                RETURNING *; 
            `
            result = await db.query(query, [updatedEvent.event_name, updatedEvent.date, eventId, user.email]);

        } else if (!updatedEvent?.date) { //if date is empty, it will only update name

            query = `
                UPDATE calendar
                SET event_name = $1, updated_at = NOW()
                WHERE calendar.id = $2 AND calendar.user_id = (SELECT id FROM users WHERE email=$3)
                RETURNING *; 
            `
            result = await db.query(query, [updatedEvent.event_name, eventId, user.email]);

        } else if (!updatedEvent?.event_name) { //if name is empty, it will only update date

            query = `
                UPDATE calendar
                SET date = $1, updated_at = NOW()
                WHERE calendar.id = $2 AND calendar.user_id = (SELECT id FROM users WHERE email=$3)
                RETURNING *; 
            `
            result = await db.query(query, [updatedEvent.date, eventId, user.email]);

        }

        return result.rows[0];
    }

}

module.exports = Calendar;