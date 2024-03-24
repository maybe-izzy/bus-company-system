const Bus = require("../models/busModel");

class BusManager {
  // Add a new bus
  async AddBus(req, res) {
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
  async GetAllBuses(req, res) {
    try {
      const buses = await Bus.find();
      buses.forEach(async (bus) => {
        const journey = new Date(bus.journeyDate);

        const departure = new Date(
          `${journey.getFullYear()}-${
            journey.getMonth() + 1
          }-${journey.getDate()} ${bus.departure}`
        );

        if (departure.getTime() - new Date().getTime() < 3600000) {
          await Bus.findByIdAndUpdate(bus._id, { status: "Completed" });
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

  async FindBusesWithStops(req, res){
    try {
      const buses = await Bus.find({
        stops: req.query.from,
        stops: req.query.to,
        journeyDate: req.query.journeyDate,
      });

      buses.forEach(async (bus) => {
        const journey = new Date(bus.journeyDate);
        const departure = new Date(
          `${journey.getFullYear()}-${
            journey.getMonth() + 1
          }-${journey.getDate()} ${bus.departure}`
        );

        if (departure.getTime() - new Date().getTime() < 3600000) {
          await Bus.findByIdAndUpdate(bus._id, { status: "Completed" });
        }
      });

      const filteredBuses = buses.filter(
        (bus) => bus.status !== "Completed" && bus.status !== "Running"
      );
      res.status(200).send({
        message: "Buses fetched successfully",
        success: true,
        data: filteredBuses,
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
  async GetBusesByFromAndTo(req, res){
    try {
      const buses = await Bus.find({
        journeyDate: req.query.journeyDate,
        stops: { $all: [req.query.from, req.query.to] } // Ensure both stops are present
      }).lean();


      buses.forEach(async (bus) => {
        const journey = new Date(bus.journeyDate);
        const departure = new Date(
          `${journey.getFullYear()}-${
            journey.getMonth() + 1
          }-${journey.getDate()} ${bus.departure}`
        );

        if (departure.getTime() - new Date().getTime() < 3600000) {
          await Bus.findByIdAndUpdate(bus._id, { status: "Completed" });
        }
      });

      const filteredBuses = buses.filter(bus => {
        const fromIndex = bus.stops.indexOf(req.query.from);
        const toIndex = bus.stops.indexOf(req.query.to);
      
        return ((bus.status !== "Completed") && (bus.status !== "Running") && 
        (fromIndex < toIndex) && (fromIndex !== -1) && (toIndex !== -1));
       
      });

      res.status(200).send({
        message: "Buses fetched successfully",
        success: true,
        data: filteredBuses,
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
  async UpdateBus(req, res) {
    // if the bus is completed , you can't update it
    const bus = await Bus.findById(req.params.id);
    if (bus.status === "Completed") {
      res.status(400).send({
        message: "You can't update a completed bus",
        success: false,
      });
    } else {
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
    }
  };

  // delete a bus
  async DeleteBus(req, res) {
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
  async GetBusById(req, res) {
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
}

module.exports = BusManager;