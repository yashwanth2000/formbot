import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { getFormById, updateForm } from "../../../utils/form";
import cancelImg from "../../../assets/cancel.png";
import LightThemeSide from "../../../assets/LightThemeSide.png";
import LightThemeMain from "../../../assets/LightThemeMain.png";
import DarkThemeSide from "../../../assets/DarkThemeSide.png";
import DarkThemeMain from "../../../assets/DarkThemeMain.png";
import TailBlueThemeSide from "../../../assets/TailBlueThemeSide.png";
import TailBlueThemeMain from "../../../assets/TailBlueThemeMain.png";
import { toast, ToastContainer } from "react-toastify";
import copy from "copy-to-clipboard";
import styles from "./EditTheme.module.css";

const EditTheme = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedTheme, setSelectedTheme] = useState();
  const [initialTheme, setInitialTheme] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFormById(id);

        if (response) {
          setSelectedTheme(response.theme);
          setInitialTheme(response.theme);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };

  const handleShare = () => {
    const url = `${import.meta.env.VITE_SHARE_URL}/share/${id}`;
    const success = copy(url);
    if (success) {
      toast.success("Link copied to clipboard", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
    } else {
      toast.error("Failed to copy. Please try again.", {
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

  const handleUpdateTheme = async () => {
    if (selectedTheme === initialTheme) {
      toast.info("No changes detected", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    try {
      const response = await updateForm(id, { theme: selectedTheme });
      if (response) {
        toast.success("Theme updated successfully", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error updating form data:", error);
    }
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <div className={styles.themeContainer}>
      <header className={styles.header}>
        <nav className={styles.middleButtons}>
          <Link
            to={`/edit/${id}`}
            className={`${styles.button} ${
              location.pathname === `/edit/${id}` ? styles.active : ""
            }`}
          >
            Edit Flow
          </Link>
          <Link
            to={`/editTheme/${id}`}
            className={`${styles.button} ${
              location.pathname === `/editTheme/${id}` ? styles.active : ""
            }`}
          >
            Edit Theme
          </Link>
          <Link
            to={`/editAnalytics/${id}`}
            className={`${styles.button} ${
              location.pathname === `/editAnalytics/${id}` ? styles.active : ""
            }`}
          >
            Response
          </Link>
        </nav>
        <div className={styles.rightButtons}>
          <button className={styles.shareBtn} onClick={handleShare}>
            Share
          </button>
          <button className={styles.saveBtn} onClick={handleUpdateTheme}>
            Update
          </button>
          <img
            src={cancelImg}
            alt="Cancel"
            className={styles.cancelIcon}
            onClick={handleCancel}
          />
        </div>
      </header>

      <main className={styles.content}>
        <aside className={styles.sidebar}>
          <h3>Customize the theme</h3>
          <div className={styles.themeOptions}>
            <div
              className={`${styles.themeOption} ${
                selectedTheme === "light" ? styles.previewSideImage : ""
              }`}
              onClick={() => handleThemeChange("light")}
            >
              <img src={LightThemeSide} alt="LightTheme" />
            </div>
            <div
              className={`${styles.themeOption} ${
                selectedTheme === "dark" ? styles.previewSideImage : ""
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              <img src={DarkThemeSide} alt="DarkTheme" />
            </div>
            <div
              className={`${styles.themeOption} ${
                selectedTheme === "tailBlue" ? styles.previewSideImage : ""
              }`}
              onClick={() => handleThemeChange("tailBlue")}
            >
              <img src={TailBlueThemeSide} alt="TailBlueTheme" />
            </div>
          </div>
        </aside>
        <section className={styles.previewContainer}>
          {selectedTheme === "light" && (
            <img
              src={LightThemeMain}
              alt="LightTheme"
              className={styles.previewImage}
            />
          )}
          {selectedTheme === "dark" && (
            <img
              src={DarkThemeMain}
              alt="DarkTheme"
              className={styles.previewImage}
            />
          )}
          {selectedTheme === "tailBlue" && (
            <img
              src={TailBlueThemeMain}
              alt="TailBlueTheme"
              className={styles.previewImage}
            />
          )}
        </section>
      </main>

      <ToastContainer />
    </div>
  );
};

export default EditTheme;
