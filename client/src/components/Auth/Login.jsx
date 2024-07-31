import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import arrowBack from "../../assets/arrow_back.png";
import showEye from "../../assets/eye.png";
import hideEye from "../../assets/hide-eye.png";
import ellipse1 from "../../assets/ellipse_1.png";
import ellipse2 from "../../assets/ellipse_2.png";
import { login } from "../../utils/auth";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.registered) {
      toast.success("Registered successfully. Please login", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });

      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    if (location.state?.passwordChanged) {
      toast.success("Password changed. Please login", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });

      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.email) newErrors.email = "Please enter your email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Please enter a password";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        setIsLoading(true);
        const response = await login(formData);
        if (response.success) {
          Cookies.set("accessToken", response.token);
          localStorage.setItem("accessToken", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          navigate("/home", { state: { loggedIn: true } });
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
        <h2>Sign In</h2>
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
        {errors.general && <p className={styles.error}>{errors.general}</p>}
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? <div className={styles.loader}></div> : "Log In"}
        </button>
        <div className={styles.registerContainer}>
          <p className={styles.registerText}>Don’t have an account?</p>
          <Link to="/register" className={styles.registerLink}>
            Register now
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
      <ToastContainer />
    </div>
  );
};

export default Login;
