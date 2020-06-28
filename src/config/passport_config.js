const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const UserModel = require("../models/user_model");

passport.use("login", new LocalStrategy({ usernameField: "username", passwordField: "password" },
  async (username, password, done) => {
    // Database Call to find the User
    try {
      // Find the user associated with the email provided by the user
      const user = await UserModel.findUserByEmail(username, password);
      if (!user) {
        // If the in the database, return a message
        return done(null, false, { message: "User not found" });
      }
      // Validate password and make sure it matches with the corresponding hash stored in the database
      // If the passwords match, it returns a value of true.
      const compare = await bcrypt.compare(password, user[0].password);
      if (!compare) {
        return done(null, false, { message: "Wrong Password" });
      }

      // Send the user information to the next middleware
      return done(null, user, { message: "Logged in Successfully" });
    } catch (error) {
      return done(error);
    }
  }));
