import passport from "passport";

import { setToken } from "../../lib/jwt.js";



const sendPopupMessage = (res, payload) => {
    res.send(`
        <script>
            window.opener.postMessage(
                ${JSON.stringify(payload)},
                '${process.env.FRONTEND_URL || "http://localhost:5173"}'
            );
            window.close();
        </script>
    `);
};

export const GoogleAuthController = (req, res, next) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};

export const GoogleCallbackController = (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user) => {
        if (err || !user) {
            return sendPopupMessage(res, {
                type: "GOOGLE_AUTH_ERROR",
                error: "Google authentication failed"
            });
        }

        const token = setToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        const safeUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture
        };

        sendPopupMessage(res, {
            type: "GOOGLE_AUTH_SUCCESS",
            user: safeUser
        });

    })(req, res, next);

};

