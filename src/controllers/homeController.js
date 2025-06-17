
//@desc render homepage
//@route "/"
//@access public
exports.getHomePage = (req, res) => {
    console.log("Home page accessed");
    // Render the home page using EJS
    
    res.render("home.ejs");
}