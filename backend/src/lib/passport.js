import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../model/user.js";
import { ENV } from "./env.js";

passport.use(new GoogleStrategy({
    clientID: ENV.CLIENT_ID,
    clientSecret: ENV.CLIENT_SECRET,
    callbackURL: `${ENV.BACKEND_URL}/api/auth/google/callback`
}, 
async (_, __, profile, done) => {
    try {
        const username = profile.displayName.replace(/\s+/g, '').toLowerCase()
        const email = profile.emails[0].value;
        const profileImage = profile.photos[0].value;
        const user = await UserModel.findOne({ email });
        if (user) {
            return done(null, user);
        }
        const newUser = await UserModel.create({
            username,
            email,
            password: "google_oauth_" + Date.now(),
            profileImage,
            type: "oauth"
        });
        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));