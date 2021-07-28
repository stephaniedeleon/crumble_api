const express = require("express");
const { requireAuthenticatedUser } = require('../middleware/security');
const Note = require("../models/notes");
const router = express.Router();
const Notes = require("../models/notes");

/** Listing notes from maintab */
router.get("/main/:id", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const maintabId = req.params.id;
        const notes = await Notes.listNotesByMain(maintabId);
        res.status(200).json({ notes });

    } catch(error) {
        next(error);
    }
})

/** Listing notes from subtab */
router.get("/sub/:id", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const subtabId = req.params.id;
        const notes = await Notes.listNotesBySubtab(subtabId);
        res.status(200).json({ notes });

    } catch(error) {
        next(error);
    }
})

/** Creating a new note from maintab */
router.post("/main/create", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const note = await Notes.createNoteFromMain({ main_id: req.body.main_id, note: req.body.note });
        res.status(201).json({ note });

    } catch(error) {
        next(error);
    }
})

/** Creating a new note from subtab */
router.post("/sub/create", requireAuthenticatedUser, async (req, res, next) => {
    
    try {
        const note = await Notes.createNoteFromSub({ sub_id: req.body.sub_id, note: req.body.note });
        res.status(201).json({ note });
        
    } catch(error) {
        next(error);
    }
})

/** Deleting a note */
router.delete("/:noteId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const noteId = req.params.noteId;
        const note = await Note.deleteNote(noteId);
        res.status(201).json({ note });

    } catch(error) {
        next(error);
    }
})

module.exports = router;