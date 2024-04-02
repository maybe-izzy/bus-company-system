const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
{
    location_name: {
      type: String,
      required: true,
    }
});

<<<<<<< HEAD
module.exports = mongoose.model("locations", locationSchema);
=======
module.exports = mongoose.model("locations", locationSchema);
>>>>>>> 6d91bb057c014e94e9a835d34610532e8ce9f47b
