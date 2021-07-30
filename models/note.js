const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Note {

    /** Fetch all notes by maintab id */
    static async listNotesByMain(main_id, user) {

        const query = `
            SELECT * FROM notes
            WHERE notes.main_id = $1 AND notes.user_id = (SELECT id FROM users WHERE email=$2)
            ORDER BY created_at DESC;
        `

        const result = await db.query(query, [main_id, user.email]);

        // return notes
        return result.rows;
    }

    /** Fetch all notes by subtab id */
    static async listNotesBySubtab(sub_id, user) {

        const query = `
            SELECT * FROM notes
            WHERE notes.sub_id = $1 AND notes.user_id = (SELECT id FROM users WHERE email=$2)
            ORDER BY created_at DESC;
        `

        const result = await db.query(query, [sub_id, user.email]);

        // return notes
        return result.rows;
    }

    /** Create a note from maintab */
    static async createNoteFromMain({ user, main_id, note }) {

        const requiredFields = ["title", "details"];
        requiredFields.forEach((field) => {
            if (!note.hasOwnProperty(field) || !note[field]) {
                throw new BadRequestError(
                    `Required field - ${field} - missing from request body.`
                );
            }
        });

        const query = `
            INSERT INTO notes (user_id, main_id, title, details)
            VALUES ((SELECT id FROM users WHERE email=$1), $2, $3, $4)
            RETURNING id, user_id, main_id, title, details, created_at;
        `;

        const result = await db.query(query, [user.email, main_id, note.title, note.details]);

        // return new note
        return result.rows[0];
    }

    /** Create a note from subtab */
    static async createNoteFromSub({ user, sub_id, note }) {

        const requiredFields = ["title", "details"];
        requiredFields.forEach((field) => {
            if (!note.hasOwnProperty(field) || !note[field]) {
                throw new BadRequestError(
                    `Required field - ${field} - missing from request body.`
                );
            }
        });

        const query = `
            INSERT INTO notes (user_id, sub_id, title, details)
            VALUES ((SELECT id FROM users WHERE email=$1), $2, $3, $4)
            RETURNING id, user_id, sub_id, title, details, created_at;
        `;

        const result = await db.query(query, [user.email, sub_id, note.title, note.details]);

        // return new note
        return result.rows[0];
    }

    /** Deleting a note */
    static async deleteNote(noteId, user) {
        const query = `
            DELETE FROM notes
            WHERE notes.id = $1 AND notes.user_id = (SELECT id FROM users WHERE email=$2);
        `;

        const result = await db.query(query, [noteId, user.email]);

        return result.rows;
    }
}

module.exports = Note;