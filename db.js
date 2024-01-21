const mongoose = require("mongoose");
const connection = require("./config/db.config.js");
const url = connection.url;

const connect = async () => {
  try {
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
module.exports = connect;