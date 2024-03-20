const fs = require("fs");
const path = require("path");
const Location = require("../models/locationModel");

class LocationsManager {
  async GetAllLocations(req, res) {
    try {
      // if the user is an admin, dont display him in the list of users
      const locations = await Location.find({});
      res.send({
        message: "Locations fetched successfully",
        success: true,
        data: locations,
      });
    } catch (error) {
      res.send({
        message: error.message,
        success: false,
        data: null,
      });
    }
  };

  async DeleteLocation(req, res) {
    try {
      await Location.findByIdAndDelete(req.params.id);
      res.status(200).send({
        message: "Location deleted successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };


    async UpdateLocation(req, res) {
      try {
        const existingLocation = await Location.findOne({ location_name: req.body.location_name });
        
        if (existingLocation){
            res.send({ message: "Location with the same name already exists", success: false, data: null })
        }       
        else {
            await Location.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).send({
              message: "Location updated successfully",
              success: true,
            });
        } 
      }
      catch (error) {
        res.status(500).send({
          message: "Location not found",
          success: false,
          data: error,
        });
      }
    };
  

  async AddLocation(req, res) {
    console.log("reached AddLocation"); 
    try {
      const existingLocation = await Location.findOne({ location_name: req.body.location_name });
      existingLocation
        ? res.send({ message: "Location already exists", success: false, data: null })
        : await new Location(req.body).save();

      res.status(200).send({
        message: "Location created successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  };

}

module.exports = LocationsManager;
