import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import ClerkSignUpModel from "../models/SignUp/ClerkSignUpModel.js";

passport.use(
  
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(" i m in passport 1");
      const email = profile.emails[0].value;
      const department = "cse"; // Customize if needed

      try {
        // Check if the clerk already exists
        let clerk = await ClerkSignUpModel.findOne({ email });

        if (!clerk) {
          // If not, create a new user
          clerk = new ClerkSignUpModel({
            name: profile.displayName,
            email: email,
            password: "", // You can set this to empty as we use Google OAuth for authentication
            department: department,
          });
          await clerk.save();
        }
        console.log(" i m in passport ")
        // Create a JWT token
        const token = jwt.sign({ id: clerk._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        // Send user data along with the token
        done(null, { clerk, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);
