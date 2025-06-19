const reception_name = document.getElementById("reception_name");
const reception_contact = document.getElementById("reception_contact");
const receptionUserName = document.getElementById("username");
const reception_password = document.getElementById("password");
const reception_email = document.getElementById("reception_email");

const receptionNameErrorDiv = document.getElementById("receptionNameError");
const receptionContactErrorDiv = document.getElementById(
  "receptionContactError"
);
const receptionUserNameErrorDiv = document.getElementById(
  "receptionUserNameError"
);
const receptionPasswordErrorDiv = document.getElementById(
  "receptionPasswordError"
);
const receptionEmailErrorDiv = document.getElementById("receptionEmailError");
const receptionSubmitButton = document.getElementById("receptionSubmitButton");

function validateReceptionName() {
  // Preventing starting empty spaces
  reception_name.value = reception_name.value.replace(/^\s+/, "");
  // Make first letter of each word uppercase
  reception_name.value = reception_name.value.replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );
  const value = reception_name.value.trim();
  const isValid = /^[A-Za-z\s]+$/.test(value);
  if (!value || !isValid) {
    receptionNameErrorDiv.textContent =
      "Enter a valid name (letters and spaces only).";
    return false;
  }
  receptionNameErrorDiv.textContent = "";
  return true;
}

function validateReceptionContact() {
  // Preventing starting empty spaces
  reception_contact.value = reception_contact.value.replace(/^\s+/, "");
  const value = reception_contact.value.trim();
  const isValid = /^[0-9]{10}$/.test(value);
  if (!value || !isValid) {
    receptionContactErrorDiv.textContent =
      "Enter a valid 10-digit contact number.";
    return false;
  }
  receptionContactErrorDiv.textContent = "";
  return true;
}

function validateReceptionUserName() {
  // Preventing starting empty spaces
  receptionUserName.value = receptionUserName.value.replace(/^\s+/, "");
  const value = receptionUserName.value.trim();
  if (!value || value.length < 3) {
    receptionUserNameErrorDiv.textContent =
      "Username must be at least 3 characters long.";
    return false;
  }
  receptionUserNameErrorDiv.textContent = "";
  return true;
}

function validateReceptionPassword() {
  // Preventing starting empty spaces
  reception_password.value = reception_password.value.replace(/^\s+/, "");
  const value = reception_password.value.trim();
  if (!value || value.length < 6) {
    receptionPasswordErrorDiv.textContent =
      "Password must be at least 6 characters long.";
    return false;
  }
  receptionPasswordErrorDiv.textContent = "";
  return true;
}

function validateReceptionEmail() {
  // Preventing starting empty spaces
  reception_email.value = reception_email.value.replace(/^\s+/, "");
  const value = reception_email.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (!value || !isValid) {
    receptionEmailErrorDiv.textContent = "Enter a valid email address.";
    return false;
  }
  receptionEmailErrorDiv.textContent = "";
  return true;
}

function validateReceptionForm() {
  const isNameValid = validateReceptionName();
  const isContactValid = validateReceptionContact();
  const isUserNameValid = validateReceptionUserName();
  const isPasswordValid = validateReceptionPassword();
  const isEmailValid = validateReceptionEmail();

  return (
    isNameValid &&
    isContactValid &&
    isUserNameValid &&
    isPasswordValid &&
    isEmailValid
  );
}
