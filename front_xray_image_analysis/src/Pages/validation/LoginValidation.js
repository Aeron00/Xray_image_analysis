function LoginValidation(values) {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(values.email)) {
      errors.email = "Invalid email format";
    }
  
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  
    if (!values.password) {
      errors.password = "Password is required";
    } else if (!passwordPattern.test(values.password)) {
      errors.password =
        "Password must be at least 8 characters long and include at least one digit, one lowercase letter, one uppercase letter, and one special character (!@#$%^&*)";
    }
  
    return errors;
  }
  
  export default LoginValidation;
  