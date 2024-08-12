import db from "../config/db.js";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
dotenv.config();

export const authenticateUser = () => {
  console.log(
    `Callback URL being used: ${process.env.DOMAIN}/auth/google/secrets`
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `https://academiadelcodigo.com/auth/google/secrets`,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      async (accessToken, refreshToken, profile, cb) => {
        /* console.log(profile); */
        try {
          const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [profile.emails[0].value]
          );
          if (result.rows.length === 0) {
            const newUser = await db.query(
              "INSERT INTO users (username, email, password, google_id) VALUES ($1, $2, $3,$4) RETURNING *",
              [
                profile.displayName,
                profile.emails[0].value,
                "google",
                profile.id,
              ]
            );
            cb(null, newUser.rows[0]);
          } else {
            // Already existing user
            cb(null, result.rows[0]);
          }
        } catch (err) {
          return cb(err);
        }
      }
    )
  );
};

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});
