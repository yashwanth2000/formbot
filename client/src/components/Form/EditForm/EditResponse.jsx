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

  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getFormById(id);

        if (response && response.analytics && response.submissions) {
          setForm(response);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      timeZone: "Asia/Kolkata",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!form) return <div>No form data available.</div>;

  const { analytics, elements, submissions } = form;
  const {
    views = 0,
    starts = 0,
    completions = 0,
    completionRate = 0,
  } = analytics;
  const noResponse = views === 0 && starts === 0 && completions === 0;

  // Get input elements and their labels
  const inputElements = elements.filter((elem) => elem.elementType === "input");
  const fieldLabels = inputElements.reduce((acc, elem) => {
    acc[elem._id] = elem.label || `Field `;
    return acc;
  }, {});

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
            className={`${styles.button} ${styles.active}`}
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
                    <th>Submitted At</th>
                    {inputElements.map((elem) => (
                      <th key={elem._id}>{fieldLabels[elem._id]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => (
                    <tr key={index}>
                      <td>{formatDate(submission.submittedAt)}</td>
                      {inputElements.map((elem) => (
                        <td key={elem._id}>
                          {submission.data[elem._id] || ""}
                        </td>
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
