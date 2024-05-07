let mongoose = require("mongoose");

const server = process.env.DATABASE_SERVER; // REPLACE WITH YOUR DB SERVER
const database = process.env.DATABASE_NAME; // REPLACE WITH YOUR DB NAME
const username = process.env.DATABASE_USERNAME; // REPLACE WITH YOUR DB USERNAME
const password = process.env.DATABASE_PASSWORD; // REPLACE WITH YOUR DB PASSWORD

class Database {
  constructor() {
    this.Mongoose = mongoose;
    this._connect();
  }

  _connect() {
    this.Mongoose.connect(
      `mongodb+srv://${username}:${password}@${server}/${database}`
    )
      .then(() => {
        console.log("Mongoose Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error", err);
      });
  }
}

module.exports = {
  connect: () => {
    return new Database();
  },
};
