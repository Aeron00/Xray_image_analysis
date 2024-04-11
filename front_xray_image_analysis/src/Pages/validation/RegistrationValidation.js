function RegistrationValidation(values) {
    const errors = {};
    const usernamePattern = /^[A-Z][a-zA-Z0-9_-]{2,19}$/; // First letter is uppercase, and total length is between 3 and 20 characters
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*\s).{8,}$/;
  
    if (!values.username) {
      errors.username = "Username is required";
    } else if (!usernamePattern.test(values.username)) {
      errors.username = "Username must start with an uppercase letter, and can only contain letters, numbers, underscores, and hyphens";
    }
  
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(values.email)) {
      errors.email = "Invalid email format";
    }
  
    if (!values.password) {
      errors.password = "Password is required";
    } else if (!passwordPattern.test(values.password)) {
      errors.password = "Password must contain at least 8 characters, including uppercase, lowercase, digits, and special characters";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!values.date_of_birth) {
      errors.dateOfBirth = "Date of Birth is required";
    } else {
      const dob = new Date(values.dateOfBirth);
      const currentDate = new Date();
      const minAge = 18;
      const minBirthDate = new Date(currentDate.getFullYear() - minAge, currentDate.getMonth(), currentDate.getDate());
      if (dob > minBirthDate) {
        errors.dateOfBirth = "You must be at least 18 years old";
      }
    }

    if (!values.gender || values.gender === "") {
      errors.gender = "Gender is required";
    }

    return errors;
  }
  
  export default RegistrationValidation;