const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  busNumber: {
    type: Number,
    required: true,
  },
  Start: {
    type: String,
    required: true,
  },
  Stop1: {
    type: String,
    required: true,
  },
  Stop2: {
    type: String,
    required: true,
  },
  Stop3: {
    type: String,
    required: true,
  },
  End: {
    type: String,
    required: true,
  },
  departure: {
    type: String,
    required: true,
  },
  arrival: {
    type: String,
    required: true,
  },
  journeyDate: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seatsBooked: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    default: "Yet to start",
  },
});

module.exports = mongoose.model("buses", busSchema);