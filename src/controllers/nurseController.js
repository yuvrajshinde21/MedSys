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
exports.saveNurse = async (req, res) => {
    try {
        const nurse = {
            nurse_name: req.body.nurse_name,
            nurse_contact: req.body.nurse_contact,
            nurse_shift: req.body.nurse_shift
        };

        const result = await nurseModel.saveNurse(nurse);
        console.log("Nurse saved with ID:", result);
        res.redirect("/reception");
    } catch (err) {
        console.error("Error saving nurse:", err);
        res.status(500).send("Error saving nurse");
    }
};

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
exports.updateNurse = async (req, res) => {
    try {
        const nurseId = req.params.nurseId;
        const { nurse_name, nurse_contact, nurse_shift } = req.body;

        await nurseModel.updateNurse(nurseId, nurse_name, nurse_contact, nurse_shift);

        console.log(`Nurse ${nurseId} updated successfully`);
        res.redirect("/reception");
    } catch (err) {
        console.error("Error updating nurse:", err);
        res.status(500).send("Error updating nurse");
    }
};

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
