module.exports = (err, req, res, next) => {
    console.error("❌ Error:", err.message);

    res.status(err.status || 500).render("error.ejs", {
        title: "Error",
        message: err.message || "Something went wrong!",
        stack: err.stack // helpful in dev
    });
};
