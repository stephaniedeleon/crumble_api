const express = require("express");
const { requireAuthenticatedUser } = require("../middleware/security");
const router = express.Router();
const Subtab = require("../models/subtab");

/** Listing subtabs from maintab */
router.get("/main/:id", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const maintabId = req.params.id;
        const subtabs = await Subtab.listSubtabsByMain(maintabId);
        res.status(200).json({ subtabs });

    } catch (error) {
        next(error);
    }
});


/** Listing subtabs from subtab */
router.get("/sub/:id", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const subtabId = req.params.id;
        const subtabs = await Subtab.listSubtabsBySubtab(subtabId);
        res.status(200).json({ subtabs });

    } catch(error) {
        next(error);
    }
})

/** Creating a new subtab from maintab */
router.post("/main/create", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const subtab = await Subtab.createSubtabFromMain({ main_id: req.body.main_id, subtab: req.body.subtab });
        res.status(201).json({ subtab });

    } catch(err) {
        next(err);
    }
});

/** Creating a new subtab from subtab */
router.post("/sub/create", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const subtab = await Subtab.createSubtabFromSub({ sub_id: req.body.sub_id, subtab: req.body.subtab });
        res.status(201).json({ subtab });

    } catch(err) {
        next(err);
    }
});

/** Deleting a subtab */
router.delete("/:subtabId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const subtabId = req.params.subtabId; 
        const subtab = await Subtab.deleteSubtab(subtabId);
        res.status(201).json({ subtab });

    } catch(err) {
        next(err);
    }
});



module.exports = router;