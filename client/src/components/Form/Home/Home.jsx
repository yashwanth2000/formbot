import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ChevronDown, Settings, LogOut, ChevronUp } from "lucide-react";
import { logout } from "../../../utils/auth";
import folderIcon from "../../../assets/folder.png";
import deleteIcon from "../../../assets/delete.png";
import styles from "./Home.module.css";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState(""); // New state for folder name

  useEffect(() => {
    if (location.state?.loggedIn) {
      toast.success("Login successful", {
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

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    if (location.state?.saved) {
      toast.success("Form saved successful", {
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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { state: { loggedOut: true } });
  };

  const capitalizeFirstLetter = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const toggleCreateFolderModal = () => {
    setShowCreateFolderModal(!showCreateFolderModal);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() !== "") {
      setFolders([...folders, { name: newFolderName }]);
      setNewFolderName("");
      toggleCreateFolderModal();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.dropdown} ref={dropdownRef}>
          <button
            className={styles.dropdownToggle}
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
          >
            {`${capitalizeFirstLetter(user.name)}'s workspace`}
            {isDropdownOpen ? (
              <ChevronUp size={20} className={styles.dropdownArrow} />
            ) : (
              <ChevronDown size={20} className={styles.dropdownArrow} />
            )}
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <a href="/settings" className={styles.dropdownItem}>
                <Settings size={16} />
                Settings
              </a>
              <a onClick={toggleLogoutModal} className={styles.dropdownItem}>
                <LogOut size={16} />
                Log Out
              </a>
            </div>
          )}
        </nav>
      </header>
      <main className={styles.mainContainer}>
        <section className={styles.folderContainer}>
          <div className={styles.createFolderSection}>
            <img
              src={folderIcon}
              alt="Add Folder"
              className={styles.folderIcon}
            />
            <button
              className={styles.addFolderButton}
              onClick={toggleCreateFolderModal}
            >
              Create Folder
            </button>
          </div>
          <div className={styles.folders}>
            {folders.map((folder, index) => (
              <div key={index} className={styles.createdFolder}>
                {folder.name}
                <img
                  src={deleteIcon}
                  alt="Delete Folder"
                  className={styles.folderIcon}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.content}>
          <div
            className={styles.createTypebot}
            onClick={() => navigate("/flow")}
          >
            <span className={styles.plus}>+</span>
            <span>Create a form bot</span>
          </div>
        </section>
      </main>
      {showLogoutModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <p>Are you sure you want to logout?</p>
            <div className={styles.modalButtons}>
              <button onClick={handleLogout}>Yes, Logout</button>
              <span className={styles.separator}>|</span>
              <button onClick={toggleLogoutModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showCreateFolderModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <p>Create New Folder</p>
            <input
              type="text"
              placeholder="Enter Folder Name"
              className={styles.input}
              aria-label="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)} // Update state on input change
            />
            <div className={styles.modalButtons}>
              <button onClick={handleCreateFolder}>Done</button>
              <span className={styles.separator}>|</span>
              <button onClick={toggleCreateFolderModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Home;
