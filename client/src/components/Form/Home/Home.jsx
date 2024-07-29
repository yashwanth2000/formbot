import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ChevronDown, Settings, LogOut, ChevronUp } from "lucide-react";
import { logout } from "../../../utils/auth";
import folderIcon from "../../../assets/folder.png";
import deleteIcon from "../../../assets/delete.png";
import styles from "./Home.module.css";
import { getAllForms, deleteForm } from "../../../utils/form";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [formData, setFormData] = useState([]);

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

    const fetchFormData = async () => {
      try {
        const response = await getAllForms();
        setFormData(response);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
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

  const handleDeleteForm = async (id) => {
    try {
      const response = await deleteForm(id);
      if (response) {
        toast.success("Form deleted successfully", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Error deleting form", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
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

          {formData.map((form, index) => (
            <div key={index} className={styles.formCard}>
              <div className={styles.formName}>{form.name}</div>
              <div className={styles.deleteIcon}>
                <img
                  src={deleteIcon}
                  alt="Delete"
                  onClick={() => handleDeleteForm(form._id)}
                />
              </div>
            </div>
          ))}
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
              onChange={(e) => setNewFolderName(e.target.value)}
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
