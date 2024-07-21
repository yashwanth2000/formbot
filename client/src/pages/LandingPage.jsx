import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import formBotImg from "../assets/formbotimg.png";
import triangleImg from "../assets/triangle.png";
import curveImg from "../assets/curve.png";
import HeroPng from "../assets/figure.png";
import chatBotDemoImg from "../assets/typebot-standard.png";
import { toast, ToastContainer } from "react-toastify";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.loggedOut) {
      toast.success("Logged out successfully", {
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
  }, [location.state, navigate, location.pathname]);

  return (
    <div className={styles.landingPageContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img
            src={formBotImg}
            alt="FormBot Logo"
            className={styles.logoIcon}
          />
          <span className={styles.logoText}>FormBot</span>
        </div>
        <nav className={styles.nav}>
          <Link to="/login" className={styles.signInButton}>
            Sign in
          </Link>
          <Link to="/register" className={styles.createButton}>
            Create a FormBot
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.initialView}>
          <h1 className={styles.title}>Build advanced chatbots visually</h1>
          <p className={styles.subtitle}>
            FormBot gives you powerful blocks to create unique chat experiences.
            Embed them anywhere on your web/mobile apps and start collecting
            results like magic.
          </p>
          <Link to="/register" className={styles.ctaButton}>
            Create a FormBot for free
          </Link>
          <div className={styles.decorations}>
            <img src={triangleImg} alt="" className={styles.triangle} />
            <img src={curveImg} alt="" className={styles.curve} />
          </div>
        </section>

        <section className={`${styles.hero} ${styles.scrollSection}`}>
          <div className={styles.heroImageContainer}>
            <div className={styles.heroImageBackground}></div>
            <img src={HeroPng} alt="Hero" className={styles.heroImage} />
          </div>
        </section>

        <section className={styles.comparisonSection}>
          <h2 className={styles.comparisonTitle}>
            Replace your old school forms with chatbots
          </h2>
          <p className={styles.comparisonSubtitle}>
            FormBot is a better way to ask for information. It leads to an
            increase in customer satisfaction and retention and multiply by 3
            your conversion rate compared to classical forms.
          </p>
          <div className={styles.comparisonContainer}>
            <div className={styles.formContainer}>
              <div className={styles.wrongMark}>✖</div>
              <form className={styles.oldForm}>
                <label>Full name </label>
                <input type="text" placeholder="Full name" />
                <label>Email </label>
                <input type="email" placeholder="Email" />
                <div className={styles.checkboxGroup}>
                  <label>What services are you interested in?</label>
                  <label>
                    <input type="checkbox" /> Website Dev
                  </label>
                  <label>
                    <input type="checkbox" /> Content Marketing
                  </label>
                  <label>
                    <input type="checkbox" /> Social Media
                  </label>
                  <label>
                    <input type="checkbox" /> UX/UI Design
                  </label>
                </div>
                <textarea placeholder="Additional Information"></textarea>
                <button type="submit">Submit</button>
              </form>
            </div>
            <div className={styles.chatbotContainer}>
              <div className={styles.rightMark}>✓</div>
              <div className={styles.chatbotDemo}>
                <p>Welcome to AA (Awesome Agency)</p>
                <img src={chatBotDemoImg} alt="Chatbot Demo" />
                <div className={styles.chatButton}>Hi!</div>
              </div>
            </div>
          </div>
          <p className={styles.tryItOut}>Try it out!</p>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <div className={styles.logo}>
                <img
                  src={formBotImg}
                  alt="formbot Logo"
                  className={styles.logoIcon}
                />
                <span className={styles.logoText}>FormBot</span>
              </div>
              <p className={styles.madeWith}>Made with ❤️ by @FormBot</p>
            </div>
            <div className={styles.linkColumn}>
              <h3>Product</h3>
              <ul>
                <li>
                  <a href="#">Status</a>
                </li>
                <li>
                  <a href="#">Documentation</a>
                </li>
                <li>
                  <a href="#">Roadmap</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h3>Community</h3>
              <ul>
                <li>
                  <a href="#">Discord</a>
                </li>
                <li>
                  <a href="#">GitHub repository</a>
                </li>
                <li>
                  <a href="#">Twitter</a>
                </li>
                <li>
                  <a href="#">LinkedIn</a>
                </li>
                <li>
                  <a href="#">OSS Friends</a>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h3>Company</h3>
              <ul>
                <li>
                  <Link to="#">About</Link>
                </li>
                <li>
                  <Link to="#">Contact</Link>
                </li>
                <li>
                  <Link to="#">Terms of Service</Link>
                </li>
                <li>
                  <Link to="#">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default LandingPage;
