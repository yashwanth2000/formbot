import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getAllFormsByFolder } from "../../../utils/form";
import { toast, ToastContainer } from "react-toastify";
import deleteIcon from "../../../assets/delete.png";
import arrowBack from "../../../assets/arrow_back.png";
import { ChevronDown, Settings, LogOut, ChevronUp } from "lucide-react";
import { deleteForm } from "../../../utils/form";
import { logout } from "../../../utils/auth";
import styles from "./FolderView.module.css";

const FolderView = () => {
  const dropdownRef = useRef(null);
  const location = useLocation();
  const folderName = location.state?.folderName;

  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteFormModal, setShowDeleteFormModal] = useState(null);
  const [selectedFormId, setSelectedFormId] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await getAllFormsByFolder(id);
        setFormData(response);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, [id]);

  const toggleDeleteFormModal = (id) => {
    setSelectedFormId(id);
    setShowDeleteFormModal(!showDeleteFormModal);
  };

  const handleDeleteForm = async () => {
    try {
      const response = await deleteForm(selectedFormId);
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
        setShowDeleteFormModal(false);
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

  const capitalizeFirstLetter = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { state: { loggedOut: true } });
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.left}>
          <p>Folder Name: {folderName}</p>
        </div>
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
        <img
          src={arrowBack}
          alt="Back"
          className={styles.arrowBack}
          onClick={handleBackClick}
        />
        <section className={styles.content}>
          <div
            className={styles.createTypebot}
            onClick={() => navigate("/flow", { state: { folderId: id } })}
          >
            <span className={styles.plus}>+</span>
            <span>Create a form bot</span>
          </div>

          {formData.map((form) => (
            <div key={form._id} className={styles.formCard}>
              <div className={styles.formName}>{form.name}</div>
              <div className={styles.deleteIcon}>
                <img
                  src={deleteIcon}
                  alt="Delete"
                  onClick={() => toggleDeleteFormModal(form._id)}
                />
              </div>
            </div>
          ))}
        </section>
      </main>
      {showDeleteFormModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <p>Are you sure you want to delete this form?</p>
            <div className={styles.modalButtons}>
              <button onClick={handleDeleteForm}>Yes, Delete</button>
              <span className={styles.separator}>|</span>
              <button onClick={toggleDeleteFormModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showLogoutModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <p>Are you sure you want to logout?</p>
            <div className={styles.modalButtons}>
              <button onClick={handleLogout}>Logout</button>
              <span className={styles.separator}>|</span>
              <button onClick={toggleLogoutModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default FolderView;
