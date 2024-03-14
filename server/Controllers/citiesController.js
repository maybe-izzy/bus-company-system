const fs = require("fs");
const path = require("path");
const Location = require("../models/locationModel");

const GetAllCities = async (req, res) => {
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


module.exports = { GetAllCities };
