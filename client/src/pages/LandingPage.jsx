import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import formBotImg from "../assets/formbotimg.png";
import triangleImg from "../assets/triangle.png";
import curveImg from "../assets/curve.png";
import HeroPng from "../assets/figure.png";
import CloseImg from "../assets/closeMark.png";
import RightImg from "../assets/rightMark.png";
import EasyExpImg from "../assets/image_1.png";
import EmbedImg from "../assets/image_2.png";
import PlatformImg from "../assets/platform.png";
import ResultImg from "../assets/result.png";
import FeatureImg from "../assets/feature.png";
import TeamsImg from "../assets/teams.png";
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

        <section className={styles.hero}>
          <div className={styles.yellowBg}></div>
          <div className={styles.blueBg}></div>
          <div className={styles.heroImageContainer}>
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
            <div className={styles.wrongMark}>
              <img src={CloseImg} alt="Close Img" />
            </div>
            <div className={styles.formContainer}>
              <form className={styles.oldForm}>
                <label>
                  Full name <span className={styles.required}>*</span>
                </label>
                <input type="text" placeholder="Full name" />
                <label>
                  Email <span className={styles.required}>*</span>
                </label>
                <input type="email" placeholder="Email" />
                <div className={styles.checkboxGroup}>
                  <p>
                    What services are you interested in?{" "}
                    <span className={styles.required}>*</span>
                  </p>
                  <div className={styles.customCheckbox}>
                    <input type="checkbox" id="websiteDev" />
                    <label htmlFor="websiteDev">Website Dev</label>
                  </div>
                  <div className={styles.customCheckbox}>
                    <input type="checkbox" id="contentMarketing" />
                    <label htmlFor="contentMarketing">Content Marketing</label>
                  </div>
                  <div className={styles.customCheckbox}>
                    <input type="checkbox" id="socialMedia" />
                    <label htmlFor="socialMedia">Social Media</label>
                  </div>
                  <div className={styles.customCheckbox}>
                    <input type="checkbox" id="uxUiDesign" />
                    <label htmlFor="uxUiDesign">UX/UI Design</label>
                  </div>
                </div>
                <div className={styles.textareaContainer}>
                  <label>
                    Additional Information{" "}
                    <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    placeholder="Additional Information"
                    className={styles.textarea}
                  ></textarea>
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
            <div className={styles.rightMark}>
              <img src={RightImg} alt="Right Img" />
            </div>
            <div className={styles.chatbotContainer}>
              <div className={styles.chatbotDemo}>
                <p>
                  Welcome to <span>AA</span> (Awesome Agency)
                </p>
                <div className={styles.gifIframeContainer}>
                  <img
                    src="https://media.giphy.com/media/XD9o33QG9BoMis7iM4/giphy.gif"
                    alt="Awesome Agency GIF"
                    className={styles.gifImage}
                  />
                  <div className={styles.chatButton}>Hi!</div>
                </div>
                <div className={styles.chatButton}>Hi!</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.easyExperienceContainer}>
          <div className={styles.easyExp}>
            <img
              src={EasyExpImg}
              alt="feature"
              className={styles.easyExpImage}
            />
            <div className={styles.easyExpImageText}>
              <h2>Easy building experience</h2>
              <p>
                All you have to do is drag and drop blocks to create your app.
                Even if you have custom needs, you can always add custom code.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.embedContainer}>
          <div className={styles.embed}>
            <div className={styles.embedText}>
              <h2>Embed it in a click</h2>
              <p>
                Embedding your formbot in your applications is a walk in the
                park. Formbot gives you several step-by-step platform- specific
                instructions. Your formbot will always feel &quot;native&quot;.
              </p>
            </div>
            <img src={EmbedImg} alt="feature" className={styles.embedImage} />
          </div>
        </section>

        <section className={styles.platformContainer}>
          <img
            src={PlatformImg}
            alt="feature"
            className={styles.platformImage}
          />
          <div className={styles.platformText}>
            <h2>Integrate with any platform</h2>
            <p>
              Formbot offers several native integrations blocks as well as
              instructions on how to embed Formbot on particular platforms.
            </p>
          </div>
        </section>

        <section className={styles.resultContainer}>
          <div className={styles.resultText}>
            <h2>Collect results in real-time</h2>
            <p>
              One of the main advantage of a chat application is that you
              collect the user&apos;s responses on each question.{" "}
              <span>You won&apos;t lose any valuable data.</span>
            </p>
          </div>
          <img src={ResultImg} alt="feature" className={styles.resultImage} />
        </section>

        <section className={styles.featureContainer}>
          <div className={styles.featureText}>
            <h2>And many more features</h2>
            <p>
              FormBot makes form building easy and comes with powerful features
            </p>
          </div>
          <img src={FeatureImg} alt="feature" className={styles.featureImg} />
          <div className={styles.featureTeams}>
            <h2>Loved by teams and creators from all around the world</h2>
            <img src={TeamsImg} alt="Teams" />
          </div>
        </section>

        <section className={styles.createContainer}>
          <div className={styles.decorations2}>
            <img src={triangleImg} alt="" className={styles.triangle2} />
            <img src={curveImg} alt="" className={styles.curve2} />
          </div>
          <div className={styles.createText}>
            <h2>Improve conversion and user engagement with FormBots </h2>
            <Link to="/register" className={styles.createLink}>
              Create a FormBot
            </Link>
            <p>No trial. Generous free plan.</p>
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

      <ToastContainer />
    </div>
  );
};

export default LandingPage;
