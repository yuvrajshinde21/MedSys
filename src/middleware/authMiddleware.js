const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.clearCookie("token");
                return res.redirect("/login");
            }
            req.user = decoded;
            next();
        });
    } else {
        res.redirect("/login");
    }
}

module.exports = verifyToken;