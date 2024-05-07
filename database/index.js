///
// Another file where you want to use getUnixTimestamp
const getUnixTimestamp = require("../helpers/getUnixTimestamp");
const User = require("../helpers/ORMs/Mongoose/schemas/users");
const OAuthToken = require("../helpers/ORMs/Mongoose/schemas/oauthtokens");

class SallaDatabase {
  constructor(DATABASE_ORM) {
    this.Database = require("../helpers/ORMs/" + DATABASE_ORM);
    this.DATABASE_ORM = DATABASE_ORM;
  }
  async connect() {
    try {
      this.connection = await this.Database.connect();
      return this.connection;
    } catch (err) {
      return null;
    }
  }
  async saveUser(data) {
    if (this.DATABASE_ORM == "TypeORM") {
      var userRepository = this.connection.getRepository("User");

      userRepository
        .save({
          username: data.name,
          email: data.email,
          email_verified_at: getUnixTimestamp(),
          verified_at: getUnixTimestamp(),
          password: "",
          remember_token: "",
        })
        .then(function (savedUser) {
          return userRepository.find();
        })
        .then(function (users) {
          console.log("All users: ", users);
        });
    }
    if (this.DATABASE_ORM == "Sequelize") {
      if (
        // if not found then create new user
        !(await this.connection.models.User.findOne({
          where: { email: data.email },
        }))
      ) {
        let user = await this.connection.models.User.create({
          username: data.name,
          email: data.email,
          email_verified_at: getUnixTimestamp(),
          verified_at: getUnixTimestamp(),
          password: "",
          remember_token: "",
        });
        return user.id;
      }
    }
    if (this.DATABASE_ORM == "Mongoose") {
      try {
        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
          return existingUser._id; // Return existing user's ID if they already exist
        } else {
          // If no user exists, create a new one
          let userObj = new User({
            username: data.name,
            email: data.email,
            email_verified_at: getUnixTimestamp(),
            verified_at: getUnixTimestamp(),
            password: "",
            remember_token: "",
          });
          await userObj.save();
          return userObj._id;
        }
      } catch (err) {
        console.log("Error in user handling:", err);
      }
    }
  }
  async saveOauth(data, user_id) {
    if (this.DATABASE_ORM == "Sequelize") {
      if (
        // if not found then create new user
        !(await this.connection.models.User.findOne({
          where: { email: data.email },
        }))
      ) {
        this.connection.models.OauthTokens.create({
          user_id: user_id,
          merchant: data.merchant.id,
          access_token: data.accessToken,
          expires_in: data.expires_in,
          refresh_token: data.refreshToken,
        })
          .then((data) => {})
          .catch((err) => {
            console.log("error inserting oath toekn", err);
          });
      }
    }
    if (this.DATABASE_ORM == "Mongoose") {
      try {
        // Check if an OAuthToken already exists for the user
        let existingToken = await OAuthToken.findOne({ user: user_id });

        if (existingToken) {
          // If it exists, update the existing token
          existingToken.merchant = data.merchant;
          existingToken.access_token = data.access_token;
          existingToken.expires_in = data.expires_in;
          existingToken.refresh_token = data.refresh_token;
          await existingToken.save();
          console.log("OAuth token updated for user:", user_id);
        } else {
          // If no token exists, create a new one
          let oauthobj = new OAuthToken({
            user: user_id,
            merchant: data.merchant,
            access_token: data.access_token,
            expires_in: data.expires_in,
            refresh_token: data.refresh_token,
          });
          await oauthobj.save();
          console.log("New OAuth token created for user:", user_id);
        }
      } catch (err) {
        console.log("error inserting or updating OAuth token", err);
      }
    }
  }
}
module.exports = (DATABASE_ORM) => new SallaDatabase(DATABASE_ORM);
