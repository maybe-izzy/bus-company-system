const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const User = require("../models/usersModel");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const moment = require("moment");


// book seat and send email to user with the booking details
const BookSeat = async (req, res) => {
  
  try {
    const newBooking = new Booking({
      ...req.body, // spread operator to get all the data from the request body
      user: req.params.userId,
      
    });
    const user = await User.findById(req.params.userId);
    // res.json(user._id)
    await newBooking.save();
    const bus = await Bus.findById(req.body.bus); // get the bus from the request body
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats]; // add the booked seats to the bus seatsBooked array in the database

    await bus.save();
    // send email to user with the booking details
    res.status(200).send({
      message: "Seat booked successfully",
      data: newBooking,
      user: user._id,
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Booking failed",
      data: error,
      success: false,
    });
  }
};

const GetAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("bus").populate("user");
    res.status(200).send({
      message: "All bookings",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to get bookings",
      data: error,
      success: false,
    });
  }
};

const GetAllBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.user_Id }).populate([
      "bus",
      "user",
    ]);
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
};

// cancel booking by id and remove the seats from the bus seatsBooked array
const CancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.booking_id);
    const user = await User.findById(req.params.user_id);
    const bus = await Bus.findById(req.params.bus_id);
    if (!booking || !user || !bus) {
      res.status(404).send({
        message: "Booking not found",
        data: error,
        success: false,
      });
    }

    booking.remove();
    bus.seatsBooked = bus.seatsBooked.filter(
      (seat) => !booking.seats.includes(seat)
    );
    await bus.save();
    res.status(200).send({
      message: "Booking cancelled successfully",
      data: booking,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking cancellation failed",
      data: error,
      success: false,
    });
  }
};

module.exports = {
  BookSeat,
  GetAllBookings,
  GetAllBookingsByUser,
  CancelBooking
};
