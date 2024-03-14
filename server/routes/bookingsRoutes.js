const express = require("express");
const router = express();
const authMiddleware = require("../middlewares/authMiddleware");
const BookingManager = require("../Controllers/BookingManager");
const bookingManager = new BookingManager(); 

router.post("/create-user", (req, res) => authController.CreateUser(req, res));
router.post("/book-seat/:userId", (req, res) => bookingManager.BookSeat(req, res));
router.get("/get-all-bookings", authMiddleware, (req, res) => bookingManager.GetAllBooking(req, res));
router.get("/:user_Id", authMiddleware, (req, res) => bookingManager.GetAllBookingsByUser(req, res));
router.delete("/:booking_id/:user_id/:bus_id", authMiddleware, (req, res) => bookingManager.CancelBooking(req, res));
router.post("/make-payment",  (req, res) => bookingManager.CancelBooking(req, res));

module.exports = router;
