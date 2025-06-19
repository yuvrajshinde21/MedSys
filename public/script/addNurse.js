
const nurse_name = document.getElementById("nurse_name");
const nurse_contact = document.getElementById("nurse_contact");

const nurseNameErrorDiv = document.getElementById("nurseNameError");
const nurseContactErrorDiv = document.getElementById("contactError");


function validateNurseName() {
    // Preventing starting empty spaces
    nurse_name.value = nurse_name.value.replace(/^\s+/, '');
    // Make first letter of each word uppercase
    nurse_name.value = nurse_name.value.replace(/\b\w/g, char => char.toUpperCase());
    const value = nurse_name.value.trim();
    const isValid = /^[A-Za-z\s]+$/.test(value);
    if (!value || !isValid) {
        nurseNameErrorDiv.textContent = "Enter a valid name (letters and spaces only).";
        return false;
    }
    nameErrorDiv.textContent = "";
    return true;
}

function validateNurseContact() {
    // Preventing starting empty spaces
    nurse_contact.value = nurse_contact.value.replace(/^\s+/, '');
    const value = nurse_contact.value.trim();
    const isValid = /^[0-9]{10}$/.test(value);
    if (!value || !isValid) {
        nurseContactErrorDiv.textContent = "Enter a valid 10-digit contact number.";
        return false;
    }       
    contactErrorDiv.textContent = "";
    return true;
}