export default class Validator {
  static noLeadingSpaces(value) {
    return value.trimStart() === value;
  }

  static isOnlyLetters(value) {
    return /^[A-Za-z\s]+$/.test(value);
  }

  static isValidUsername(value) {
    return /^[a-zA-Z0-9_]+$/.test(value);
  }

  static isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  static isValidPassword(value) {
    return value.length >= 6; 
  }

  static isNotEmpty(value) {
    return value.trim() !== "";
  }

  static isValidContact(value) {
    return /^\d{10}$/.test(value); 
  }
}
