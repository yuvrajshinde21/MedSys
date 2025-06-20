const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.clearCookie("token");
                console.log("Token verification failed:", err);
                console.log("Redirecting to login page due to invalid token. ",token);
                return res.redirect("/auth/login");
            }
            req.user = decoded;
            next();
        });
    } else {
        res.redirect("/auth/login");
    }
}

module.exports = verifyToken;