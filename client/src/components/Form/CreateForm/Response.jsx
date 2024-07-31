import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import cancelImg from "../../../assets/cancel.png";
import { getFormById } from "../../../utils/form";
import { useFormContext } from "../../../utils/FormContext.jsx";
import styles from "./Response.module.css";

const Response = () => {
  const navigate = useNavigate();
  const { formData, handleSave, handleShare } = useFormContext();
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await getFormById(formData._id);
        if (response && response.analytics && response.submissions) {
          setAnalytics(response.analytics);
          setSubmissions(response.submissions);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    if (formData._id) {
      fetchData();
    }
  }, [formData._id]);

  const handleCancel = () => {
    navigate("/home");
  };

  const onSave = async () => {
    await handleSave();
  };

  const onShare = () => {
    handleShare();
  };

  const {
    views = 0,
    starts = 0,
    completions = 0,
    completionRate = 0,
  } = analytics;
  const noResponse = views === 0 && starts === 0 && completions === 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      timeZone: "Asia/Kolkata",
      month: "short",
      day: "2-digit",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  };

  const groupSubmissions = (submissions) => {
    const grouped = {};
    submissions.forEach((sub) => {
      const key =
        sub.submittedAt.split("T")[0] +
        " " +
        sub.submittedAt.split("T")[1].split(".")[0];
      if (!grouped[key]) {
        grouped[key] = {};
      }
      grouped[key][sub.elementId] = sub.value;
    });
    return Object.entries(grouped).map(([key, value]) => ({
      submittedAt: key,
      ...value,
    }));
  };

  const groupedSubmissions = groupSubmissions(submissions);

  return (
    <div className={styles.responseContainer}>
      <header className={styles.header}>
        <nav className={styles.middleButtons}>
          <Link
            to="/flow"
            className={`${styles.button} ${
              location.pathname === "/flow" ? styles.active : ""
            }`}
          >
            Flow
          </Link>
          <Link
            to="/theme"
            className={`${styles.button} ${
              location.pathname === "/theme" ? styles.active : ""
            }`}
          >
            Theme
          </Link>
          <Link
            className={`${styles.button} ${
              location.pathname === "/analytics" ? styles.active : ""
            }`}
          >
            Response
          </Link>
        </nav>
        <div className={styles.rightButtons}>
          <button className={styles.shareBtn} onClick={onShare}>
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

      <main className={styles.main}>
        {noResponse ? (
          <section className={styles.noResponseContainer}>
            <p>No Response yet collected</p>
          </section>
        ) : (
          <>
            <section className={styles.statsContainer}>
              <div className={`${styles.statItem} ${styles.firstStat}`}>
                <p>Views</p>
                <p>{views}</p>
              </div>
              <div className={styles.statItem}>
                <p>Starts</p>
                <p>{starts}</p>
              </div>
              <div className={`${styles.statItem} ${styles.thirdStat}`}>
                <p className={styles.thirdStatP}>Completion Rate</p>
                <p>{completionRate ? `${completionRate * 100}%` : "0%"}</p>
              </div>
            </section>

            <section className={styles.tableContainer}>
              <table className={styles.submissionsTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Submitted At</th>
                    <th>Field 1</th>
                    <th>Field 2</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedSubmissions.map((submission, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{formatDate(submission.submittedAt)}</td>
                      <td>{submission._id || ""}</td>
                      <td>{submission._id || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Response;
