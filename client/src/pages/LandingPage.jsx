import { Link } from "react-router-dom";
import formBotImg from "../assets/formbotimg.png";
import triangleImg from "../assets/triangle.png";
import curveImg from "../assets/curve.png";
import HeroPng from "../assets/figure.png";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
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
        <section className={styles.hero}>
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
          <div className={styles.figure}>
            <img src={HeroPng} alt="HeroPng" />
          </div>
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
    </div>
  );
};

export default LandingPage;
