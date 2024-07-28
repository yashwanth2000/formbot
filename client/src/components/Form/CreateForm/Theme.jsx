import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [selectedTheme, setSelectedTheme] = useState("light");

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <div className={styles.themeContainer}>
      <header className={styles.header}>
        <nav className={styles.middleButtons}>
          <Link to="/flow" className={styles.button}>
            Flow
          </Link>
          <Link className={styles.button}>Theme</Link>
          <Link to="/analytics" className={styles.button}>
            Response
          </Link>
        </nav>
        <div className={styles.rightButtons}>
          <button className={styles.shareBtn}>Share</button>
          <button className={styles.saveBtn}>Save</button>
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
                selectedTheme === "light" ? styles.active : ""
              }`}
              onClick={() => handleThemeChange("light")}
            >
              <img src={LightThemeSide} alt="LightTheme" />
            </div>
            <div
              className={`${styles.themeOption} ${
                selectedTheme === "dark" ? styles.active : ""
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              <img src={DarkThemeSide} alt="DarkTheme" />
            </div>
            <div
              className={`${styles.themeOption} ${
                selectedTheme === "tailblue" ? styles.active : ""
              }`}
              onClick={() => handleThemeChange("tailblue")}
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
          {selectedTheme === "tailblue" && (
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
