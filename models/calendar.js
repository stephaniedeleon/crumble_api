const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Calendar {

    /** Fetch all events for maintab */
    static async listEventsForMaintab(main_id) {

        const query = `
            SELECT * FROM calendar
            WHERE calendar.main_id = $1
            ORDER BY date ASC;
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
        ORDER BY date ASC;
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

        //create a new event - store in database
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

        //create a new event - store in database
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

        return result.rows[0];
    }

    /** Updating an event */
    static async updateEvent({eventId, updatedEvent}) {

        let query;
        let result;

        if (updatedEvent?.event_name && updatedEvent?.date) { //runs if they edited both

            query = `
                UPDATE calendar
                SET event_name = $1, date = $2, updated_at = NOW()
                WHERE calendar.id = $3
                RETURNING *; 
            `
            result = await db.query(query, [updatedEvent.event_name, updatedEvent.date, eventId]);

        } else if (!updatedEvent?.date) { //if date is empty, it will only update name

            query = `
                UPDATE calendar
                SET event_name = $1, updated_at = NOW()
                WHERE calendar.id = $2
                RETURNING *; 
            `
            result = await db.query(query, [updatedEvent.event_name, eventId]);

        } else if (!updatedEvent?.event_name) { //if name is empty, it will only update date

            query = `
                UPDATE calendar
                SET date = $1, updated_at = NOW()
                WHERE calendar.id = $2
                RETURNING *; 
            `
            result = await db.query(query, [updatedEvent.date, eventId]);

        }

        return result.rows[0];
    }

}

module.exports = Calendar;