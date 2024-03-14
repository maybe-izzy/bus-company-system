const express = require("express");
const router = express();
const authMiddleware = require("../middlewares/authMiddleware");
const BusManager = require("../Controllers/BusManager");

// Create an instance of the AuthController class
const busManager = new BusManager();

router.post("/add-bus", authMiddleware, (req, res) => busManager.AddBus(req, res));
router.post("/get-all-buses", authMiddleware, (req, res) => busManager.GetAllBuses(req, res));
router.put("/:id", authMiddleware, (req, res) => busManager.UpdateBus(req, res));
router.delete("/:id", authMiddleware, (req, res) => busManager.DeleteBus(req, res));
router.get("/:id", authMiddleware, (req, res) => busManager.GetBusById(req, res));
router.post("/get", authMiddleware, (req, res) => busManager.GetBusesByFromAndTo(req, res));

module.exports = router;