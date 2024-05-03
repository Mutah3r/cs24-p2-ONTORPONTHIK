const userModel = require("../models/user_accounts");
const jwt = require("jsonwebtoken");
const rateLimiter = require("express-rate-limit");

exports.islogin = async function(req, res, next) {
    try {
        const token = req.body.token;
        // Check if the token exists in user_account
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Verify the token
        jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
            next();
        });
    } catch (error) {
        console.log("Some error occured");
    }
};

exports.limiter = rateLimiter({
	windowMs: 1 * 60 * 1000, // 1 minutes
	limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
    message:{
        message:"Please try again after 1 minute"
    },
});
