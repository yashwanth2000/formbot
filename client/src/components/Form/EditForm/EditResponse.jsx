import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import cancelImg from "../../../assets/cancel.png";
import { getFormById } from "../../../utils/form.js";
import { toast, ToastContainer } from "react-toastify";
import copy from "copy-to-clipboard";
import styles from "./EditResponse.module.css";

const EditResponse = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFormById(id);

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

    fetchData();
  }, [id]);

  const handleCancel = () => {
    navigate("/home");
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

  // Determine unique field IDs for table headers
  const fieldIds = [...new Set(submissions.map((sub) => sub.elementId))];
  const fieldHeaders = fieldIds.map((id, index) => `Field ${index + 1}`);

  return (
    <div className={styles.responseContainer}>
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
                <p>
                  {completionRate
                    ? `${Math.floor(completionRate * 100)}%`
                    : "0%"}
                </p>
              </div>
            </section>

            <section className={styles.tableContainer}>
              <table className={styles.submissionsTable}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Submitted At</th>
                    {fieldHeaders.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupedSubmissions.map((submission, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{formatDate(submission.submittedAt)}</td>
                      {fieldIds.map((id, i) => (
                        <td key={i}>{submission[id] || ""}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>

      <ToastContainer />
    </div>
  );
};

export default EditResponse;
