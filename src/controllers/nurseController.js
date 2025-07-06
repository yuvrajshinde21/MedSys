const asyncHandler = require("express-async-handler");
const nurseModel = require("../models/nurseModel");
//Add nurse controller
exports.addNurse = (req, res) => {
    res.render("reception/receptionDashboard.ejs", {
        main_content: "addNurse",
        title: "Add Nurse",
        message: "Add a new nurse to the hospital.",
    });
};

// Save nurse to database   
exports.saveNurse = asyncHandler(async (req, res) => {
    const nurse = {
        nurse_name: req.body.nurse_name,
        nurse_contact: req.body.nurse_contact,
        nurse_shift: req.body.nurse_shift
    };

    const result = await nurseModel.saveNurse(nurse);
    req.flash("successMessage", "Nurse registration completed successfully.");
    res.redirect("/reception/nurses/new");

});

// View all nurses controller
exports.viewNurses = async (req, res) => {
    try {
        const nurses = await nurseModel.getAllNurses();
        res.render("reception/receptionDashboard.ejs", {
            main_content: "viewNurses",
            title: "View Nurses",
            nurses: nurses,
        });
    } catch (err) {
        console.error("Error fetching nurses:", err);
        res.status(500).send("Error fetching nurses");
    }
};

// Get nurse by ID controller
exports.getNurseById = async (req, res) => {
    try {
        const nurseId = req.params.nurseId;
        const nurse = await nurseModel.getNurseById(nurseId);
        if (!nurse) {
            return res.status(404).send("Nurse not found");
        }

        res.render("reception/receptionDashboard.ejs", {
            main_content: "editNurse",
            title: "Edit Nurse",
            nurse: nurse
        });
    } catch (err) {
        console.error("Error fetching nurse:", err);
        res.status(500).send("Error fetching nurse");
    }
};

// Update nurse controller
exports.updateNurse = asyncHandler(async (req, res) => {
    const nurseId = req.params.nurseId;
    const { nurse_name, nurse_contact, nurse_shift } = req.body;
    if (!nurse_name || !nurse_contact || !nurse_shift) {
        req.flash("errorMessage", "All fields are required.")
        return res.redirect(`/reception/nurse/edit/${nurseId}`);
    }
    await nurseModel.updateNurse(nurseId, nurse_name, nurse_contact, nurse_shift);

    req.flash("successMessage", `Nurse '${nurse_name}' updated successfully.`)
    return res.redirect("/reception/nurses");

});

// Delete nurse controller
exports.deleteNurse = async (req, res) => {
    try {
        const nurseId = req.params.nurseId;
        const result = await nurseModel.deleteNurse(nurseId);

        if (result) {
            console.log(`Nurse ${nurseId} deleted successfully`);
            res.redirect("/reception/nurses");
        } else {
            res.status(404).send("Nurse not found");
        }
    } catch (err) {
        console.error("Error deleting nurse:", err);
        res.status(500).send("Error deleting nurse");
    }
};
