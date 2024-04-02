const Bus = require("../models/busModel");
const moment = require('moment-timezone');

// Add a new bus
const AddBus = async (req, res) => {
  try {
    const existingBus = await Bus.findOne({ busNumber: req.body.busNumber });
    existingBus
      ? res.send({ message: "Bus already exists", success: false, data: null })
      : await new Bus(req.body).save();

    res.status(200).send({
      message: "Bus created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get all buses and if the journeyDate is passed 1 hour ago , make the status of the bus to "Completed"
const GetAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    buses.forEach(async (bus) => {
      const departure = moment.tz(`${bus.journeyDate} ${bus.stopTimes[0]}`, 'YYYY-MM-DD HH:mm', 'America/New_York');
      const arrival = moment.tz(`${bus.journeyDate} ${bus.stopTimes[bus.stopTimes.length -1]}`, 'YYYY-MM-DD HH:mm', 'America/New_York');
      const now = moment.tz('America/New_York'); // Current time in the same timezone as the departure and arrival
    
      // If the current time is after the departure time but before the arrival time, the bus is running
      if (now.isAfter(departure) && now.isBefore(arrival)) {
        await Bus.findByIdAndUpdate(bus._id, { status: "Running" });
      }
      // If the current time is after the arrival time, the journey has been completed
      else if (now.isAfter(arrival)) {
        await Bus.findByIdAndUpdate(bus._id, { status: "Completed" });
      }
      // Optionally handle the case where the bus has not yet departed
      else if (now.isBefore(departure)) {
        await Bus.findByIdAndUpdate(bus._id, { status: "Yet to start" });
      }
    });
    

    const orderedBuses = buses.sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") {
        return 1;
      } else if (a.status !== "Completed" && b.status === "Completed") {
        return -1;
      } else {
        return new Date(a.journeyDate) - new Date(b.journeyDate);
      }
    });

    res.status(200).send({
      message: "Buses fetched successfully",
      success: true,
      data: orderedBuses,
    });
  } catch (error) {
    res.status(500).send({
      message: "No Buses Found",
      success: false,
      data: error,
    });
  }
};

// get all buses by from and to
const GetBusesByFromAndTo = async (req, res) => {
  try {
    const buses = await Bus.find({
      journeyDate: req.query.journeyDate,
      stops: { $all: [req.query.from, req.query.to] } // Ensure bus has both stops in its route
    }).lean();
    
    buses.forEach(async (bus) => {
      const departure = moment.tz(`${bus.journeyDate} ${bus.stopTimes[0]}`, 'YYYY-MM-DD HH:mm', 'America/New_York');
      const arrival = moment.tz(`${bus.journeyDate} ${bus.stopTimes[bus.stopTimes.length -1]}`, 'YYYY-MM-DD HH:mm', 'America/New_York');
      const now = moment.tz('America/New_York'); // Current time in the same timezone as the departure and arrival
    
      // If the current time is after the departure time but before the arrival time, the bus is running
      if (now.isAfter(departure) && now.isBefore(arrival)) {
        await Bus.findByIdAndUpdate(bus._id, { status: "Running" });
      }
      // If the current time is after the arrival time, the journey has been completed
      else if (now.isAfter(arrival)) {
        await Bus.findByIdAndUpdate(bus._id, { status: "Completed" });
      }
      // Optionally handle the case where the bus has not yet departed
      else if (now.isBefore(departure)) {
        await Bus.findByIdAndUpdate(bus._id, { status: "Yet to start" });
      }
    });

    const filteredBuses = buses.filter(bus => {
      const fromIndex = bus.stops.indexOf(req.query.from);
      const toIndex = bus.stops.indexOf(req.query.to);
      return ((bus.status !== "Completed") && (bus.status !== "Running") && 
      (fromIndex < toIndex) && (fromIndex !== -1) && (toIndex !== -1));
    });
    
    
  

    const modifiedBuses = filteredBuses.map(bus => {
      const fromIndex = bus.stops.indexOf(req.query.from);
      const toIndex = bus.stops.indexOf(req.query.to);
      // Create a new object with only the from and to fields added to the original bus object.
      // This ensures that the original bus object is not mutated.
      return {
          bus: bus, 
          from: req.query.from, 
          to: req.query.to,
          arrival: bus.stopTimes[bus.stops.indexOf(req.query.to)], 
          departure: bus.stopTimes[bus.stops.indexOf(req.query.from)] 
        
      };
    });
   
    res.status(200).send({
      message: "Buses fetched successfully",
      success: true,
      data: modifiedBuses,
    });
  } catch (error) {
    res.status(500).send({
      message: "No Buses Found",
      success: false,
      data: error,
    });
  }
};

// update a bus
const UpdateBus = async (req, res) => {
  // if the bus is completed , you can't update it
  const bus = await Bus.findById(req.params.id);
  
    try {
      await Bus.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).send({
        message: "Bus updated successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: "Bus not found",
        success: false,
        data: error,
      });
    }
  
};

// delete a bus
const DeleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: "Bus deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get bus by id
const GetBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    res.status(200).send({
      message: "Bus fetched successfully",
      success: true,
      data: bus,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  AddBus,
  GetAllBuses,
  UpdateBus,
  DeleteBus,
  GetBusById,
  GetBusesByFromAndTo,
};
