document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("nurse_name");
    const contactInput = document.getElementById("nurse_contact");
    const shiftSelect = document.getElementById("nurse_shift");
    const form = document.querySelector("form");

    const nameError = document.getElementById("nurseNameError");
    const contactError = document.getElementById("contactError");

    // Live validation for Nurse Name
    nameInput.addEventListener("input", function () {
        let value = this.value.replace(/^\s+/, '');

        // Capitalize each word
        value = value.replace(/\b\w+/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

        // Enforce max length of 30 characters
        if (value.length > 30) {
            value = value.slice(0, 30);
        }
        this.value = value;

        // Validation checks
        if (value.trim() === "") {
            showError(nameError, "Nurse name cannot be empty.");
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
            showError(nameError, "Nurse name must contain only letters and spaces.");
        } else {
            clearError(nameError);
        }
    });

    // Live validation for Contact Number
    contactInput.addEventListener("input", function () {
        let value = this.value.replace(/^\s+/, '').replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        this.value = value;

        if (value.length !== 10) {
            showError(contactError, "Contact must be exactly 10 digits.");
        } else {
            clearError(contactError);
        }
    });

    // Validate on form submit
    form.addEventListener("submit", function (e) {
        let valid = true;
        const nameValue = nameInput.value.trim();
        const contactValue = contactInput.value.trim();
        const shiftValue = shiftSelect.value.trim();

        if (nameValue === "") {
            showError(nameError, "Nurse name cannot be empty.");
            valid = false;
        } else if (!/^[A-Za-z\s]+$/.test(nameValue)) {
            showError(nameError, "Nurse name must contain only letters and spaces.");
            valid = false;
        } else if (nameValue.length > 30) {
            showError(nameError, "Nurse name must be at most 30 characters.");
            valid = false;
        } else {
            clearError(nameError);
        }

        if (contactValue.length !== 10) {
            showError(contactError, "Contact must be exactly 10 digits.");
            valid = false;
        } else {
            clearError(contactError);
        }

        if (shiftValue === "") {
            alert("Please select a shift.");
            valid = false;
        }

        if (!valid) e.preventDefault();
    });

    function showError(errorDiv, message) {
        errorDiv.textContent = message;
    }

    function clearError(errorDiv) {
        errorDiv.textContent = "";
    }
});
