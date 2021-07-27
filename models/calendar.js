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

        return result.rows;
    }

    /** Updating an event */
    static async updateEvent({eventId, updatedEvent}) {

        const query = `
            UPDATE calendar
            SET event_name = $1, date = $2, updated_at = NOW()
            WHERE calendar.id = $3
            RETURNING *; 
        `
        const result = await db.query(query, [updatedEvent.event_name, updatedEvent.date, eventId]);

        return result.rows;
    }

}

module.exports = Calendar;