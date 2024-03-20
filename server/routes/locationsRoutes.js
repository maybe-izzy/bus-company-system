const express = require("express");
const router = express();
const authMiddleware = require("../middlewares/authMiddleware");
const LocationsManager = require("../Controllers/LocationsManager");

// Create an instance of the AuthController class
const locationsManager = new LocationsManager();

router.post("/get-all-locations", authMiddleware, (req, res) => locationsManager.GetAllLocations(req, res));
router.post("/add-location", authMiddleware, (req, res) => locationsManager.AddLocation(req, res));
router.delete("/:id", authMiddleware, (req, res) => locationsManager.DeleteLocation(req, res));
router.put("/:id", authMiddleware, (req, res) => locationsManager.UpdateLocation(req, res));

module.exports = router;
