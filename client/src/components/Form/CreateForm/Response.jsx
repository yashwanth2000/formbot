import { useNavigate, Link } from "react-router-dom";
import cancelImg from "../../../assets/cancel.png";
import styles from "./Response.module.css";

const Response = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <div className={styles.responseContainer}>
      <header className={styles.header}>
        <nav className={styles.middleButtons}>
          <Link to="/flow" className={styles.button}>
            Flow
          </Link>
          <Link to="/theme" className={styles.button}>
            Theme
          </Link>
          <Link className={styles.button}>Response</Link>
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

      <main className={styles.main}>
        <div className={styles.statsContainer}>
          <div className={`${styles.statItem} ${styles.firstStat}`}>
            <p>Views</p>
            <p>0</p>
          </div>
          <div className={styles.statItem}>
            <p>Starts</p>
            <p>0</p>
          </div>
          <div className={`${styles.statItem} ${styles.thirdStat}`}>
            <p className={styles.thirdStatP}>Completion Rate</p>
            <p>100%</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Response;
