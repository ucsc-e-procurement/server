const passport = require("passport");
// Passport strategies
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
// We use this to extract the JWT sent by the user
const ExtractJWT = require("passport-jwt").ExtractJwt;

// Bcrypt for Hashing Passwords
const bcrypt = require("bcrypt");

// User Model - Databases Interaction Handling
const UserModel = require("../models/user_model");

// Using Local Strategy
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
      console.log("UUUUUUUUUUUUUUUUUSSSSSSSSSSS: ", user);
      // Send the user information to the next middleware
      return done(null, user, { message: "Logged in Successfully" });
    } catch (error) {
      return done(error);
    }
  }));

// This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  // secret we used to sign our JWT
  secretOrKey: "top_secret_key_here",
  // we expect the user to send the token as a query parameter with the name 'secret_token'
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}, async (token, done) => {
  try {
    // Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));
