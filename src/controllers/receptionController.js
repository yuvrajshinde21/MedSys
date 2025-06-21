//Room_ Controller
let receptionModel = require("../models/receptionModel");
const asyncHandler = require("express-async-handler");

exports.showReceptionDashboard = async (req, res) => {
    //get receptionist info 
    const receptionistId = req.user.user_id;
    const receptionistInfo = await receptionModel.getReceptionistInfo(receptionistId);
    res.render("reception/receptionDashboard.ejs"
        // ,{
        // main_content: "receptionistInfo",
        // receptionist: receptionistInfo,
        // title: "Reception Dashboard",
        // message: "Welcome to the Reception Dashboard"
        // }
    );

};
//----------search=============================
exports.searchPatients = async (req, res) => {
    const query = req.query.q;
    try {
        const results = await receptionModel.searchPatientsByNameOrContact(query);
        res.json(results); // send array of patients
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


//  ============================= Room Controller  =============================
//render AddRoom.ejs form:
exports.renderAddRoom = (req, res) => {
    res.render("reception/receptionDashboard.ejs", {
        main_content: "addRoom",
        title: "Add Room",
        message: "Add a new room to the hospital.",
    });
};

//create room controller:
exports.createRoom = asyncHandler(async (req, res) => {
    const room_no = req.body.room_no.trim();
    const room_type = req.body.room_type.trim();
    const room_status = req.body.room_status.trim();
    const charges_per_day = req.body.charges_per_day.trim();

    if (!room_no || !room_type || !room_status || !charges_per_day) {
        return res.render("reception/receptionDashboard", {
            main_content: "AddRoom",
            message: "All fields are required."
        });
    }
    const data = await receptionModel.createRoom({  //try to click on createRomm says there are two definationa by vscode
        room_no,
        room_type,
        room_status,
        charges_per_day
    });
    res.render("reception/receptionDashboard", {
        main_content: "AddRoom",
        message: data.message

    });
});
  
  

//View all rooms controller:
exports.viewRooms = async (req, res) => {
    try {
        const rooms = await receptionModel.getAllRooms();
        res.render("reception/receptionDashboard.ejs", {
            main_content: "viewRooms",
            title: "View Rooms",
            rooms: rooms,
        });
    } catch (err) {
        console.error("Error fetching rooms:", err);
        res.status(500).send("Error fetching rooms");
        next(err);
    }
};

//get room by id : //somthig is wrong with this function=======================
exports.getRoomById = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const room = await receptionModel.getRoomById(roomId);
        if (!room) {
            return res.status(404).send("Room not found");
        }

        const roomTypes = await receptionModel.getRoomTypes();

        res.render("reception/receptionDashboard.ejs", {
            main_content: "editRoom",
            title: "Edit Room",
            room: room,
            roomTypes: roomTypes,
        });
    } catch (err) {
        console.error("Error fetching room:", err);
        res.status(500).send("Error fetching room");
    }
};

//Update room information controller:
exports.updateRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const { room_type, room_status, charges_per_day } = req.body;

        await receptionModel.updateRoom(
            roomId,
            room_type,
            room_status,
            charges_per_day
        );

        console.log(`Room ${roomId} updated successfully`);
        res.redirect("/reception");
    } catch (err) {
        console.error("Error updating room:", err);
        res.status(500).send("Error updating room");
    }
};

//Delete room controller:
exports.deleteRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const result = await receptionModel.deleteRoom(roomId);
        console.log(result);

        if (result) {
            console.log(`Room ${roomId} deleted successfully`);
            res.redirect("/reception/rooms");
        } else {
            res.status(404).send("Room not found");
        }
    } catch (err) {
        console.error("Error deleting room:", err);
        res.status(500).send("Error deleting room");
    }
};

//Generate Bill
// exports.generateBill = async (req, res) => {
//     try {
//         const patientId = req.params.patientId;

//         const patient = await receptionModel.getPatientById(patientId);
//         const appointment = await receptionModel.getLatestAppointmentByPatient(
//             patientId
//         );
//         const doctor = await receptionModel.getDoctorById(appointment.doctor_id);
//         const admission = await receptionModel.getAdmissionByAppointmentId(
//             appointment.appointment_id
//         );

//         let room = { room_no: "-", room_type: "N/A", price: 0 };
//         let nurse = { nurse_name: "N/A", shift: "-", charge: 0 };
//         let roomDays = 0;
//         let roomTotal = 0;

//         if (admission) {
//             if (admission.room_no) {
//                 room = await receptionModel.getRoomByNo(admission.room_no);

//                 // Calculate days between admitted and discharge date
//                 const admittedDate = new Date(admission.admitted_date);
//                 const dischargeDate = admission.discharge_date
//                     ? new Date(admission.discharge_date)
//                     : new Date();

//                 // Calculate the total number of days (at least 1)
//                 const diffTime = Math.abs(dischargeDate - admittedDate);
//                 roomDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

//                 roomTotal = roomDays * room.price;
//             }

//             if (admission.nurse_id) {
//                 nurse = await receptionModel.getNurseById(admission.nurse_id);
//             }
//         }

//         const prescriptions = await receptionModel.getPrescriptionsByPatientId(
//             patientId
//         );
        

//         res.render("reception/receptionDashboard", {
//             main_content: "generateBill",
//             title: "Generate Bill",
//             patient,
//             doctor,
//             appointment,
//             room,
//             roomDays,
//             roomTotal,
//             admission,
//             nurse,
//             prescriptions,
//         });
//     } catch (err) {
//         console.error("Error generating bill:", err);
//         res.status(500).send("Internal Server Error");
//     }
// };
//==================
//Generate Bill
// Generate Bill and Store in DB (if not already)
exports.generateBill = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const patient = await receptionModel.getPatientById(patientId);
    const appointment = await receptionModel.getLatestAppointmentByPatient(patientId);
    const doctor = await receptionModel.getDoctorById(appointment.doctor_id);
    const admission = await receptionModel.getAdmissionByAppointmentId(appointment.appointment_id);

    let room = { room_no: "-", room_type: "N/A", charges_per_day: 0 };
    let nurse = { nurse_name: "N/A", shift: "-", charge: 0 };
    let roomDays = 0;
    let roomTotal = 0;

    if (admission && admission.room_no) {
      room = await receptionModel.getRoomByNo(admission.room_no);
      const admittedDate = new Date(admission.admitted_date);
      const dischargeDate = admission.discharge_date ? new Date(admission.discharge_date) : new Date();
      const diffTime = Math.abs(dischargeDate - admittedDate);
      roomDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      roomTotal = roomDays * parseFloat(room.charges_per_day || 0);
    }

    if (admission && admission.nurse_id) {
      nurse = await receptionModel.getNurseById(admission.nurse_id);
      nurse.charge = 500; // fixed placeholder
    }

    const prescriptions = await receptionModel.getPrescriptionsByPatientId(patientId);

    const medicineCharges = prescriptions.reduce((total, p) => {
      const qty = parseFloat(p.quantity || 0);
      const price = parseFloat(p.price || 0);
      return total + qty * price;
    }, 0);

    const treatmentCharges = prescriptions.length * 100;
    const nurseCharges = nurse.charge || 0;
    const totalAmount = roomTotal + treatmentCharges + nurseCharges + medicineCharges;

    const existingBill = await receptionModel.getBillByPatientId(patientId);
    if (!existingBill) {
      await receptionModel.insertBill({
        patient_id: patientId,
        room_charges: roomTotal,
        treatment_charges: treatmentCharges,
        nurse_charges: nurseCharges,
        medicine_charges: medicineCharges,
        total_amount: totalAmount,
        billing_date: new Date()
      });
    }

    res.render("reception/receptionDashboard", {
      main_content: "generateBill",
      title: "Generate Bill",
      patient,
      doctor,
      appointment,
      room,
      roomDays,
      roomTotal,
      admission,
      nurse,
      prescriptions,
      medicineCharges,
      nurseCharges,
      treatmentCharges,
      totalAmount
    });

  } catch (err) {
    console.error("Error generating bill:", err);
    res.status(500).send("Internal Server Error");
  }
};



//===================
//
// Render Final Printable Bill Page


exports.renderPrintBill = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const patient = await receptionModel.getPatientById(patientId);
    const appointment = await receptionModel.getLatestAppointmentByPatient(patientId);
    const doctor = await receptionModel.getDoctorById(appointment.doctor_id);
    const admission = await receptionModel.getAdmissionByAppointmentId(appointment.appointment_id);
    const bill = await receptionModel.getBillByPatientId(patientId); // ✔ get stored bill

    let room = { room_no: "-", room_type: "N/A", charges_per_day: 0 };
    let roomDays = 0;

    if (admission && admission.room_no) {
      room = await receptionModel.getRoomByNo(admission.room_no);
      const admittedDate = new Date(admission.admitted_date);
      const dischargeDate = admission.discharge_date ? new Date(admission.discharge_date) : new Date();
      const diffTime = Math.abs(dischargeDate - admittedDate);
      roomDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    let nurse = { nurse_name: "N/A", shift: "-", charge: 0 };
    if (admission && admission.nurse_id) {
      nurse = await receptionModel.getNurseById(admission.nurse_id);
      nurse.charge = bill.nurse_charges || 0;
    }

    const prescriptions = await receptionModel.getPrescriptionsByPatientId(patientId);

    res.render("reception/printBill", {
      patient,
      doctor,
      appointment,
      room,
      roomDays,
      admission,
      nurse,
      prescriptions,
      bill
    });

  } catch (err) {
    console.error("Error rendering print bill:", err);
    res.status(500).send("Internal Server Error");
  }
};



//get all admited patients===========================================================================

exports.showAdmittedPatients = asyncHandler(async (req, res) => {
    const admittedPatients = await receptionModel.getAdmittedPatients();
    const availableRooms = await receptionModel.getAvailableRooms();
    const availableNurses = await receptionModel.getAvailableNurses();

    res.render("reception/receptionDashboard", {
        main_content: "allAdmittedPatients",
        admittedPatients,
        availableRooms,
        availableNurses
    });
});

// asign room
exports.assignRoom = asyncHandler(async (req, res) => {
    const admissionId = req.params.id;
    const { room_no } = req.body;

    const success = await receptionModel.assignRoom(admissionId, room_no);

    if (success) {
        req.flash("successMessage", "Room assigned successfully.");
    } else {
        req.flash("errorMessage", "Room is no longer available. Please choose another.");
    }

    res.redirect("/reception/admitted-patients");
});


//assign nurse
exports.assignNurse = asyncHandler(async (req, res) => {
    const admissionId = req.params.id;
    const { nurse_id } = req.body;

    try {
        await receptionModel.assignNurseToPatient(admissionId, nurse_id);

        req.flash("successMessage", "Nurse assigned successfully.");
        res.redirect("/reception/admitted-patients");
    } catch (error) {
        console.error("Assign Nurse Error:", error);
        req.flash("errorMessage", "Failed to assign nurse. Please try again.");
        res.redirect("/reception/admitted-patients");
    }
});

