const express = require("express");
const { requireAuthenticatedUser } = require("../middleware/security");
const router = express.Router();
const Subtab = require("../models/subtab");


/** Fetching a subtab by id */
router.get("/:subtabId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const sub_id = req.params.subtabId; 
        const subtab = await Subtab.fetchSubtabById(sub_id, user);
        if (!subtab) {
            throw new NotFoundError("Sub tab not found");
        }
        res.status(200).json({ subtab });

        console.log({subtab});

    } catch (err) {
        next(err);
    }

});

/** Listing subtabs from maintab */
router.get("/main/:id", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const maintabId = req.params.id;
        const subtabs = await Subtab.listSubtabsByMain(maintabId, user);
        res.status(200).json({ subtabs });

    } catch (error) {
        next(error);
    }
});

/** Listing subtabs from subtab */
router.get("/sub/:id", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const subtabId = req.params.id;
        const subtabs = await Subtab.listSubtabsBySubtab(subtabId, user);
        res.status(200).json({ subtabs });

    } catch(error) {
        next(error);
    }
});

/** Creating a new subtab from maintab */
router.post("/main/create", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const subtab = await Subtab.createSubtabFromMain({ user, main_id: req.body.main_id, subtab: req.body.subtab });
        res.status(201).json({ subtab });

        console.log({subtab});

    } catch(err) {
        next(err);
    }
});

/** Creating a new subtab from subtab */
router.post("/sub/create", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const subtab = await Subtab.createSubtabFromSub({ user, sub_id: req.body.sub_id, subtab: req.body.subtab });
        res.status(201).json({ subtab });

    } catch(err) {
        next(err);
    }
});

/** Deleting a subtab */
router.delete("/:subtabId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const subtabId = req.params.subtabId; 
        const subtab = await Subtab.deleteSubtab(subtabId, user);
        res.status(201).json({ subtab });

    } catch(err) {
        console.log(err);
        next(err);
    }
});

/** Updating a subtab */
router.put("/:subtabId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const subtabId = req.params.subtabId; 
        const subtab = await Subtab.updateSubtab({subtabId, newName: req.body.name, user});
        res.status(201).json({ subtab });

    } catch(err) {
        next(err);
    }
});

/** Marking a subtab */
router.put("/mark/:subtabId", requireAuthenticatedUser, async (req, res, next) => {
    
    try {
        const user = res.locals.user;
        const subtabId = req.params.subtabId;
        const subtab = await Subtab.markSubtab(subtabId, user);
        res.status(201).json({ subtab });

    } catch(err) {
        next(err);
    }
});

/** Unmarking a subtab */
router.put("/unmark/:subtabId", requireAuthenticatedUser, async (req, res, next) => {
    
    try {
        const user = res.locals.user;
        const subtabId = req.params.subtabId;
        const subtab = await Subtab.unmarkSubtab(subtabId, user);
        res.status(201).json({ subtab });

    } catch(err) {
        next(err);
    }
});


/** Return object containing directory tree data */
router.get("/:maintabId/directory", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const maintabId = req.params.maintabId;
        const directoryData = await Subtab.getDirectoryData(maintabId, user);
        res.status(200).json({ directoryData });

    } catch (err) {
        next(err);
    }
});


module.exports = router;