const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const bcrypt = require("bcryptjs")

// Use environment variables for sensitive information
const GOOGLE_CLIENTID = process.env.GOOGLE_CLIENTID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENTID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/success",
    },
    async (accessToken, refreshToken, profile, done) => {
   
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  try{
    done(null, user);
  }catch(error){
    done(error, null);
  }
  
});
