const saveMedicine = require("../models/medicineModel");

//Ad medicine form
exports.addMedicine = (req, res) => {
  res.render("reception/receptionDashboard.ejs", {
    main_content: "addMedicine",
    title: "Add Medicine",
    message: "Add a new medicine to the hospital.",
  });
};

// Save medicine
exports.saveMedicine = async (req, res) => {
  try {
    const { medicine_name, price } = req.body;
    await saveMedicine.saveMedicine(medicine_name, price);
    res.render("reception/receptionDashboard.ejs", {
      main_content: "addMedicine",
      title: "Add Medicine",
      message: "Add a new medicine to the hospital.",
    });
  } catch (error) {
    console.error("Error saving medicine:", error);
    res.status(500).send("Internal Server Error");
  }
};

// View all medicines
exports.viewMedicines = async (req, res) => {
  try {
    const medicines = await saveMedicine.viewMedicines();
    res.render("reception/receptionDashboard.ejs", {
      main_content: "viewMedicines",
      title: "View Medicines",
      medicines: medicines,
      message: "List of all medicines in the hospital.",
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).send("Internal Server Error");
  }
};

// deleteMedicine
exports.deleteMedicine = async (req, res) => {
  try {
    const medicineId = req.params.medicineId;
    const result = await saveMedicine.deleteMedicine(medicineId);
    console.log(result);

    if (result) {
      console.log(`Medicine ${medicineId} deleted successfully`);
      res.redirect("/reception/medicines");
    } else {
      res.status(404).send("Medicine not found");
    }
  } catch (err) {
    console.error("Error deleting medicine:", err);
    res.status(500).send("Error deleting medicine");
  }
};
