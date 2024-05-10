const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/webhookDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the app authorization data
const authSchema = new mongoose.Schema({
  merchant: Number,
  accessToken: String,
  refreshToken: String,
  expires: Number,
});

// Create a model from the schema
const AuthData = mongoose.model("AuthData", authSchema);

const app = express();
app.use(bodyParser.json());

// Define a POST endpoint to handle incoming webhooks
app.post("/webhook", async (req, res) => {
  const { event, merchant, data } = req.body;

  if (event === "app.store.authorize" && data) {
    // Store the data both locally and in MongoDB
    const { access_token, refresh_token, expires } = data;

    // Create a new document from the data
    const newAuthData = new AuthData({
      merchant: merchant,
      accessToken: access_token,
      refreshToken: refresh_token,
      expires: expires,
    });

    // Save the document in MongoDB
    try {
      await newAuthData.save();
      console.log("Data saved:", newAuthData);
      res.status(200).send("Data processed and stored successfully.");
    } catch (error) {
      console.error("Error saving data:", error);
      res.status(500).send("Error processing data.");
    }
  } else {
    // If the event is not 'app.store.authorize', simply acknowledge the request
    res.status(200).send("Event not relevant for storage.");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
