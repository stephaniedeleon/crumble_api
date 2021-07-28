const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Note {

    /** Fetch all notes by maintab id */
    static async listNotesByMain(main_id) {
        const query = `
            SELECT * FROM notes
            WHERE notes.main_id = $1
            ORDER BY created_at DESC;
        `

        const result = await db.query(query, [main_id]);

        // return notes
        return result.rows;
    }

    /** Fetch all notes by subtab id */
    static async listNotesBySubtab(sub_id) {
        const query = `
            SELECT * FROM notes
            WHERE notes.sub_id = $1
            ORDER BY created_at DESC;
        `

        const result = await db.query(query, [sub_id]);

        // return notes
        return result.rows;
    }

    /** Create a note from maintab */
    static async createNoteFromMain({ main_id, note }) {
        const requiredFields = ["title", "details"];
        requiredFields.forEach((field) => {
            if (!note.hasOwnProperty(field) || !note[field]) {
                throw new BadRequestError(
                    `Required field - ${field} - missing from request body.`
                );
            }
        });

        const query = `
            INSERT INTO notes (main_id, title, details)
            VALUES ($1, $2, $3)
            RETURNING id, main_id, title, details, created_at;
        `;

        const result = await db.query(query, [main_id, note.title, note.details]);

        // return new note
        return result.rows[0];
    }

    /** Create a note from subtab */
    static async createNoteFromSub({ sub_id, note }) {
        const requiredFields = ["title", "details"];
        requiredFields.forEach((field) => {
            if (!note.hasOwnProperty(field) || !note[field]) {
                throw new BadRequestError(
                    `Required field - ${field} - missing from request body.`
                );
            }
        });

        const query = `
            INSERT INTO notes (sub_id, title, details)
            VALUES ($1, $2, $3)
            RETURNING id, sub_id, title, details, created_at;
        `;

        const result = await db.query(query, [sub_id, note.title, note.details]);

        // return new note
        return result.rows[0];
    }

    /** Deleting a note */
    static async deleteNote(id) {
        const query = `
            DELETE FROM notes
            WHERE notes.id = $1
        `;

        const result = await db.query(query, [id]);

        return result.rows;
    }
}

module.exports = Note;