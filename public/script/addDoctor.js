// DOM Elements
const doctor_name = document.getElementById("doctor_name");
const doctor_username = document.getElementById("username");
const doctor_contact = document.getElementById("doctor_contact");
const doctor_email = document.getElementById("doctor_email");
const doctor_experience = document.getElementById("doctor_experience");
const doctor_image = document.getElementById("doctor_image");
const doctor_specialization = document.getElementById("doctor_specialization");
const doctor_status = document.getElementById("status");
const doctor_password = document.getElementById("password");
// Error Divs
const nameErrorDiv = document.getElementById("doctorNameError");
const usernameErrorDiv = document.getElementById("usernameError");
const contactErrorDiv = document.getElementById("contactError");
const emailErrorDiv = document.getElementById("emailError");
const experienceErrorDiv = document.getElementById("experienceError");
const imageErrorDiv = document.getElementById("imageError");
const specializationErrorDiv = document.getElementById("specializationError");
const statusErrorDiv = document.getElementById("statusError");
const passwordErrorDiv = document.getElementById("passwordError");

function validateDoctorname() {
    //preventing starting empty spaces
    doctor_name.value = doctor_name.value.replace(/^\s+/, '');
    //make first letter of each word uppercase
    doctor_name.value = doctor_name.value.replace(/\b\w/g, char => char.toUpperCase());
    const value = doctor_name.value.trim();
    const isValid = /^[A-Za-z\s]+$/.test(value);
    if (!value || !isValid) {
        nameErrorDiv.textContent = "Enter a valid name (letters and spaces only).";
        return false;
    }
    nameErrorDiv.textContent = "";
    return true;
}

function validateDoctorUsername() {
     //preventing starting empty spaces
    doctor_username.value = doctor_username.value.replace(/^\s+/, '');
    const value = doctor_username.value.trim();
    const isValid = /^[A-Za-z0-9_]+$/.test(value);
    if (!value || !isValid) {
        usernameErrorDiv.textContent = "Enter a valid username (letters, numbers, underscores).";
        return false;
    }
    usernameErrorDiv.textContent = "";
    return true;
}

function validateContact() {
     //preventing starting empty spaces
    doctor_contact.value = doctor_contact.value.replace(/^\s+/, '');
    const value = doctor_contact.value.trim();
    const isValid = /^[0-9]{10}$/.test(value);
    if (!value || !isValid) {
        contactErrorDiv.textContent = "Enter a valid 10-digit contact number.";
        return false;
    }
    contactErrorDiv.textContent = "";
    return true;
}

function validateEmail() {
    const value = doctor_email.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!value || !isValid) {
        emailErrorDiv.textContent = "Enter a valid email address.";
        return false;
    }
    emailErrorDiv.textContent = "";
    return true;
}

function validateExperience() {
    const value = doctor_experience.value.trim();
    const number = Number(value);
    if (!value || isNaN(number) || number < 0) {
        experienceErrorDiv.textContent = "Enter valid years of experience (0 or more).";
        return false;
    }
    experienceErrorDiv.textContent = "";
    return true;
}

function validateSpecialization() {
    const value = doctor_specialization.value;
    if (value === "") {
        specializationErrorDiv.textContent = "Select a specialization.";
        return false;
    }
    specializationErrorDiv.textContent = "";
    return true;
}

function validateStatus() {
    const value = doctor_status.value;
    if (value === "") {
        statusErrorDiv.textContent = "Select a status.";
        return false;
    }
    statusErrorDiv.textContent = "";
    return true;
}

function validateImage() {
    const file = doctor_image.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!file) {
        imageErrorDiv.textContent = "Upload a doctor image.";
        return false;
    }

    if (!validTypes.includes(file.type)) {
        imageErrorDiv.textContent = "Only JPG, PNG, and GIF formats allowed.";
        return false;
    }

    if (file.size > maxSize) {
        imageErrorDiv.textContent = "Image must be under 2MB.";
        return false;
    }

    imageErrorDiv.textContent = "";
    return true;
}


function validatePassword() {
     //preventing starting empty spaces
    doctor_password.value = doctor_password.value.replace(/^\s+/, '');

    const value = doctor_password.value.trim();
    const isValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
    
    if (!value) {
        passwordErrorDiv.textContent = "Password is required.";
        return false;
    }

    if (!isValid) {
        passwordErrorDiv.textContent = "Password must be at least 6 characters with letters and at least one number and one special character.";
        return false;
    }

    passwordErrorDiv.textContent = "";
    return true;
}

function validateDoctorForm() {
    const validName = validateDoctorname();
    const validUsername = validateDoctorUsername();
    const validContact = validateContact();
    const validEmail = validateEmail();
    const validExperience = validateExperience();
    const validSpecialization = validateSpecialization();
    const validStatus = validateStatus();
    const validImage = validateImage();
    const validPassword = validatePassword();

    return (
        validName &&
        validUsername &&
        validContact &&
        validEmail &&
        validExperience &&
        validSpecialization &&
        validStatus &&
        validImage &&
        validPassword
    );
}

// Live feedback
doctor_name.addEventListener("input", validateDoctorname);
doctor_username.addEventListener("input", validateDoctorUsername);
doctor_contact.addEventListener("input", validateContact);
doctor_email.addEventListener("input", validateEmail);
doctor_experience.addEventListener("input", validateExperience);
doctor_specialization.addEventListener("change", validateSpecialization);
doctor_status.addEventListener("change", validateStatus);
doctor_image.addEventListener("change", validateImage);
doctor_password.addEventListener("input", validatePassword);

