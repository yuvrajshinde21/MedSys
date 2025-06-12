
//@desc render homepage
//@route "/"
//@access public
exports.getHomePage = (req, res) => {
    res.render("home.ejs");
}