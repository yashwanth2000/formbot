import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useFormContext } from "../../../utils/FormContext.jsx";
import cancelImg from "../../../assets/cancel.png";
import LightThemeSide from "../../../assets/LightThemeSide.png";
import LightThemeMain from "../../../assets/LightThemeMain.png";
import DarkThemeSide from "../../../assets/DarkThemeSide.png";
import DarkThemeMain from "../../../assets/DarkThemeMain.png";
import TailBlueThemeSide from "../../../assets/TailBlueThemeSide.png";
import TailBlueThemeMain from "../../../assets/TailBlueThemeMain.png";
import styles from "./Theme.module.css";

const Theme = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const folderId = location.state?.folderId;
  const { formData, updateFormData, handleSave, handleShare } =
    useFormContext();
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(formData.theme || "light");

  useEffect(() => {
    if (selectedTheme !== formData.theme) {
      updateFormData({ theme: selectedTheme });
    }
  }, [selectedTheme, updateFormData, formData.theme]);

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    updateFormData({ theme });
  };

  const onSave = async () => {
    updateFormData({
      folderId: folderId || null,
    });
    const savedForm = await handleSave();
    if (savedForm) {
      setIsSaved(true);
      navigate("/home", { state: { formSaved: true } });
    }
  };

  const onShare = () => {
    handleShare();
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <div className={styles.themeContainer}>
      <header className={styles.header}>
        <nav className={styles.middleButtons}>
          <Link
            to="/flow"
            state={{ folderId }}
            className={`${styles.button} ${
              location.pathname === "/flow" ? styles.active : ""
            }`}
          >
            Flow
          </Link>
          <Link
            className={`${styles.button} ${
              location.pathname === "/theme" ? styles.active : ""
            }`}
          >
            Theme
          </Link>
          <Link
            to="/analytics"
            state={{ folderId }}
            className={`${styles.button} ${
              location.pathname === "/analytics" ? styles.active : ""
            }`}
          >
            Response
          </Link>
        </nav>
        <div className={styles.rightButtons}>
          <button
            className={styles.shareBtn}
            onClick={onShare}
            disabled={!isSaved}
          >
            Share
          </button>
          <button className={styles.saveBtn} onClick={onSave}>
            Save
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
    </div>
  );
};

export default Theme;
