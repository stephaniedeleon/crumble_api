const express = require("express");
const { requireAuthenticatedUser } = require('../middleware/security');
const Note = require("../models/note");
const router = express.Router();

/** Listing notes from maintab */
router.get("/main/:id", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const maintabId = req.params.id;
        const notes = await Note.listNotesByMain(maintabId, user);
        res.status(200).json({ notes });

    } catch(error) {
        next(error);
    }
})

/** Listing notes from subtab */
router.get("/sub/:id", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const subtabId = req.params.id;
        const notes = await Note.listNotesBySubtab(subtabId, user);
        res.status(200).json({ notes });

    } catch(error) {
        next(error);
    }
})

/** Creating a new note from maintab */
router.post("/main/create", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const note = await Note.createNoteFromMain({ user, main_id: req.body.main_id, note: req.body.note });
        res.status(201).json({ note });

    } catch(error) {
        console.log(error)
        next(error);
    }
})

/** Creating a new note from subtab */
router.post("/sub/create", requireAuthenticatedUser, async (req, res, next) => {
    
    try {
        const user = res.locals.user;
        const note = await Note.createNoteFromSub({ user, sub_id: req.body.sub_id, note: req.body.note });
        res.status(201).json({ note });
        
    } catch(error) {
        console.log(error)
        next(error);
    }
})

/** Deleting a note */
router.delete("/:noteId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const noteId = req.params.noteId;
        const note = await Note.deleteNote(noteId, user);
        res.status(201).json({ note });

    } catch(error) {
        next(error);
    }
})

module.exports = router;