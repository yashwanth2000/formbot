import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import cancelImg from "../../../assets/cancel.png";
import { getFormById } from "../../../utils/form";
import styles from "./Response.module.css";

const Response = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [submissions, setSubmissions] = useState([]);

  console.log(submissions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFormById("66a89cac2365454bc40b8898");
        if (response && response.analytics && response.submissions) {
          setFormData(response.analytics);
          setSubmissions(response.submissions);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCancel = () => {
    navigate("/home");
  };

  const {
    views = 0,
    starts = 0,
    completions = 0,
    completionRate = 0,
  } = formData || {};
  const noResponse = views === 0 && starts === 0 && completions === 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
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
                    <th></th>
                    <th>Submitted At</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {groupedSubmissions.map((submission, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{formatDate(submission.submittedAt)}</td>
                      <td>{submission["66a89cac2365454bc40b889e"] || ""}</td>
                      <td>{submission["66a89cac2365454bc40b88a0"] || ""}</td>
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
