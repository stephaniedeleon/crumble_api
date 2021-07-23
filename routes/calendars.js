const express = require("express");
const { requireAuthenticatedUser } = require("../middleware/security");
const router = express.Router();
const Calendar = require("../models/calendar");

/** Listing events for calendar for maintab */
router.get("/main/:maintabId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const main_id = req.params.maintabId; 
        const events = await Calendar.listEventsForMaintab(main_id);
        res.status(200).json({ events });

    } catch (error) {
        next(error);
    }
});

/** Listing events for calendar for subtab */
router.get("/sub/:subtabId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const sub_id = req.params.subtabId;
        const events = await Calendar.listEventsForSubtab(sub_id);
        res.status(200).json({ events });

    } catch (error) {
        next(error);
    }
});

/** Creating a new event in maintab */
router.post("/main/create", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const event = await Calendar.createEventForMaintab({ main_id: req.body.main_id, event: req.body.event });
        res.status(201).json({ event });

    } catch(err) {
        next(err);
    }
});

/** Creating a new event in subtab */
router.post("/sub/create", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const event = await Calendar.createEventForSubtab({ sub_id: req.body.sub_id, event: req.body.event });
        res.status(201).json({ event });

    } catch(err) {
        next(err);
    }
});


/** Deleting an event */
router.delete("/:eventId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const event_id = req.params.eventId;
        const event = await Calendar.deleteEvent(event_id);
        res.status(201).json({ event });

    } catch(err) {
        next(err);
    }
});


module.exports = router;