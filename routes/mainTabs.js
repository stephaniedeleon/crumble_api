const express = require("express");
const { requireAuthenticatedUser } = require("../middleware/security");
const router = express.Router();
const MainTab = require("../models/mainTab");


/** Fetching a maintab by id */
router.get("/:maintabId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const maintabId = req.params.maintabId; 
        const maintab = await MainTab.fetchMaintabById(maintabId, user);
        if (!maintab) {
            throw new NotFoundError("Main tab not found");
        }
        res.status(200).json({ maintab });

    } catch (err) {
        next(err);
    }

});

/** Listing maintabs */
router.get("/", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const maintabs = await MainTab.listMaintabsForUser(user);
        res.status(200).json({ maintabs });

    } catch (error) {
        next(error);
    }
});

/** Creating a new maintab */
router.post("/create", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const maintab = await MainTab.createMaintab({ user, maintab: req.body });
        res.status(201).json({ maintab });

    } catch(err) {
        next(err);
    }
});

/** Deleting a maintab */
router.delete("/:maintabId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const maintabId = req.params.maintabId; 
        const maintab = await MainTab.deleteMaintab(maintabId, user);
        res.status(201).json({ maintab });

    } catch(err) {
        next(err);
    }
});

/** Updating a maintab */
router.put("/:maintabId", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const maintabId = req.params.maintabId; 
        const maintab = await MainTab.updateMaintab({maintabId, newName: req.body.name, user});
        res.status(201).json({ maintab });

    } catch(err) {
        next(err);
    }
});


module.exports = router;