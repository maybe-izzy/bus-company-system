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
  from: {
    type: String,
    required: false,
  },
  to: {
    type: String,
    required: false,
  },
  stops: {
    type: Array, 
    required: true, 
  },
  stopTimes: {
    type: Array, 
    required: false, 
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
