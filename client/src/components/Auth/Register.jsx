import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import arrowBack from "../../assets/arrow_back.png";
import showEye from "../../assets/eye.png";
import hideEye from "../../assets/hide-eye.png";
import ellipse1 from "../../assets/ellipse_1.png";
import ellipse2 from "../../assets/ellipse_2.png";
import { registerUser } from "../../utils/auth";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.name) newErrors.name = "Please enter your name";
    if (!formData.email) newErrors.email = "Please enter your email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Please enter a password";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        setIsLoading(true);
        const response = await registerUser(formData);
        if (response.success) {
          navigate("/login", { state: { registered: true } });
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        setErrors({ ...newErrors, general: errorMsg });
        console.error("Error:", errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <img
        src={arrowBack}
        alt="Back"
        className={styles.arrowBack}
        onClick={handleBackClick}
      />
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Create an account</h2>
        <div className={styles.inputContainer}>
          <label
            htmlFor="name"
            className={errors.name ? styles.errorLabel : ""}
          >
            Username
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your username"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.inputField} ${
              errors.name ? styles.errorInput : ""
            }`}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>
        <div className={styles.inputContainer}>
          <label
            htmlFor="email"
            className={errors.email ? styles.errorLabel : ""}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.inputField} ${
              errors.email ? styles.errorInput : ""
            }`}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.inputContainer}>
          <label
            htmlFor="password"
            className={errors.password ? styles.errorLabel : ""}
          >
            Password
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.inputField} ${
                errors.password ? styles.errorInput : ""
              }`}
            />
            <img
              src={showPassword ? hideEye : showEye}
              alt={showPassword ? "Hide Password" : "Show Password"}
              className={styles.showIcon}
              onClick={togglePasswordVisibility}
            />
          </div>
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <div className={styles.inputContainer}>
          <label
            htmlFor="confirmPassword"
            className={errors.confirmPassword ? styles.errorLabel : ""}
          >
            Confirm Password
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.inputField} ${
                errors.confirmPassword ? styles.errorInput : ""
              }`}
            />
            <img
              src={showConfirmPassword ? hideEye : showEye}
              alt={
                showConfirmPassword
                  ? "Hide Confirm Password"
                  : "Show Confirm Password"
              }
              className={styles.showIcon}
              onClick={toggleConfirmPasswordVisibility}
            />
          </div>
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>
        {errors.general && <p className={styles.error}>{errors.general}</p>}
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? <div className={styles.loader}></div> : "Sign Up"}
        </button>
        <div className={styles.loginContainer}>
          <p className={styles.loginText}>Already have an account?</p>
          <Link to="/login" className={styles.loginLink}>
            Login
          </Link>
        </div>
      </form>
      <div className={styles.decorations}>
        <svg
          width="203"
          height="215"
          viewBox="0 0 203 215"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.triangle1}
        >
          <path
            d="M31.3441 5.9595C32.0311 1.39207 37.4048 -0.718915 41.0168 2.15972L200.259 129.069C203.871 131.948 203.012 137.657 198.713 139.346L9.18558 213.799C4.88659 215.487 0.371552 211.889 1.05851 207.322L31.3441 5.9595Z"
            fill="#E67200"
          />
        </svg>
        <svg
          width="202"
          height="214"
          viewBox="0 0 202 214"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.triangle2}
        >
          <path
            d="M30.516 5.64981C31.2029 1.08238 36.5767 -1.02861 40.1887 1.85003L199.431 128.759C203.043 131.638 202.184 137.347 197.885 139.036L8.35745 213.489C4.05846 215.178 -0.456573 211.579 0.230385 207.012L30.516 5.64981Z"
            fill="#FF8B1A"
          />
        </svg>

        <img src={ellipse1} alt="" className={styles.ellipse_1} />
        <img src={ellipse2} alt="" className={styles.ellipse_2} />
      </div>
    </div>
  );
};

export default Register;
