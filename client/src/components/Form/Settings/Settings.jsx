import { useState } from "react";
import nameIcon from "../../../assets/name.png";
import arrowBack from "../../../assets/arrow_back.png";
import emailIcon from "../../../assets/email.png";
import passwordIcon from "../../../assets/lock.png";
import showEye from "../../../assets/eye.png";
import hideEye from "../../../assets/hide-eye.png";
import logoutIcon from "../../../assets/logout.png";
import styles from "./Settings.module.css";
import { updateUser, deleteUser } from "../../../utils/user";
import { logout } from "../../../utils/auth";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Settings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    oldPassword: "",
    newPassword: "",
  });

  const userId = user._id;
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPasswordIcon, setShowOldPasswordIcon] = useState(false);
  const [showNewPasswordIcon, setShowNewPasswordIcon] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        localStorage.removeItem("accessToken");
        Cookies.remove("accessToken");
        navigate("/register", { state: { deleted: true } });
      } else {
        console.error("Error deleting account:", response.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
    setShowOldPasswordIcon(!showOldPasswordIcon);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
    setShowNewPasswordIcon(!showNewPasswordIcon);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await updateUser(userId, formData);
      if (response.success) {
        toast.success("Profile updated successfully", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });

        localStorage.setItem("user", JSON.stringify(response.user));

        if (formData.newPassword) {
          localStorage.removeItem("accessToken");
          Cookies.remove("accessToken");
          navigate("/login", { state: { passwordChanged: true } });
        }

        setFormData({
          ...formData,
          oldPassword: "",
          newPassword: "",
        });
      } else {
        console.error("Error updating profile:", response.message);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { state: { loggedOut: true } });
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <>
      <div className={styles.settingsContainer}>
        <img
          src={arrowBack}
          alt="Back"
          className={styles.arrowBack}
          onClick={handleBackClick}
        />
        <h2>Settings</h2>
        <form onSubmit={handleUpdate} className={styles.updateForm}>
          <div className={styles.inputContainer}>
            <img src={nameIcon} alt="Name Icon" className={styles.inputIcon} />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputContainer}>
            <img
              src={emailIcon}
              alt="Email Icon"
              className={styles.inputIcon}
            />
            <input
              type="email"
              name="email"
              placeholder="Update Email"
              value={formData.email}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputContainer}>
            <img
              src={passwordIcon}
              alt="Password Icon"
              className={styles.inputIcon}
            />
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              placeholder="Old Password"
              value={formData.oldPassword}
              onChange={handleChange}
              className={styles.inputField}
            />
            <img
              src={showOldPasswordIcon ? hideEye : showEye}
              alt={showOldPassword ? "Hide Password" : "Show Password"}
              className={`${styles.showIcon} ${
                showOldPasswordIcon ? styles.active : ""
              }`}
              onClick={toggleOldPasswordVisibility}
            />
          </div>
          <div className={styles.inputContainer}>
            <img
              src={passwordIcon}
              alt="Confirm Password Icon"
              className={styles.inputIcon}
            />
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className={styles.inputField}
            />
            <img
              src={showNewPasswordIcon ? hideEye : showEye}
              alt={
                showNewPassword
                  ? "Hide Confirm Password"
                  : "Show Confirm Password"
              }
              className={`${styles.showIcon} ${
                showNewPasswordIcon ? styles.active : ""
              }`}
              onClick={toggleNewPasswordVisibility}
            />
          </div>
          <button type="submit" className={styles.button}>
            Update
          </button>
          <button
            type="button"
            className={styles.delButton}
            onClick={toggleModal}
          >
            Delete User
          </button>
        </form>
        <div className={styles.logout}>
          <img src={logoutIcon} alt="Logout" className={styles.icon} />
          <button className={styles.logoutButton} onClick={toggleLogoutModal}>
            Log Out
          </button>
        </div>
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <p>Are you sure you want to delete your account?</p>
              <div className={styles.modalButtons}>
                <button onClick={handleDeleteAccount}>Yes, Delete</button>
                <span className={styles.separator}>|</span>
                <button onClick={toggleModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {showLogoutModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <p>Are you sure you want Logout?</p>
              <div className={styles.modalButtons}>
                <button onClick={handleLogout}>Yes, Logout</button>
                <span className={styles.separator}>|</span>
                <button onClick={toggleLogoutModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default Settings;
