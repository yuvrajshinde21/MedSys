const doctor_name = document.getElementById("doctor_name");
const errorDiv = document.getElementById("doctorNameError");

doctor_name.addEventListener("input", validateDoctorname);



function validateDoctorname() {
    this.value = this.value.replace(/^\s+/, "");

    const isValid = /^[A-Za-z\s]*$/.test(this.value);

    if (!isValid) {
        errorDiv.textContent = "Invalid doctor name. Only letters are allowed.";
        return false;
    } else {
        errorDiv.textContent = "";
        return true;
    }
}
function validateDoctorUsername() {
    this.value = this.value.replace(/^\s+/, "");
    const isValid = this.value.length > 0;

    if (!isValid) {
        errorDiv.textContent = "Invalid doctor username. Only letters, numbers, and underscores are allowed.";
        return false;
    } else {
        errorDiv.textContent = "";
        return true;
    }
}

function validateDoctorForm() {
    const isNameValid = validateDoctorname.call(doctor_name);
    const isUsernameValid = validateDoctorUsername.call(doctor_username);
    // Add calls to other validation functions here

    return isNameValid && isUsernameValid; // Return true only if all validations pass
}