import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getFormById,
  updateInputValue,
  updateFormAnalytics,
} from "../../../utils/form";
import SendICon from "../../../assets/send.png";
import styles from "./ShareForm.module.css";

const ShareForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({});
  const [showNextElement, setShowNextElement] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [clickedButtons, setClickedButtons] = useState({});
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const fetchedForm = await getFormById(formId);
        setForm(fetchedForm);
        setTheme(fetchedForm.theme.toLowerCase());

        await updateFormAnalytics(
          formId,
          fetchedForm.analytics.completions,
          fetchedForm.analytics.views + 1,
          fetchedForm.analytics.starts
        );
      } catch (error) {
        console.error("Error fetching form:", error);
      }
    };

    fetchForm();
  }, [formId]);

  useEffect(() => {
    if (form && currentElementIndex < form.elements.length && showNextElement) {
      const currentElement = form.elements[currentElementIndex];
      if (currentElement.elementType === "bubble") {
        const timer = setTimeout(() => {
          setCurrentElementIndex((prev) => prev + 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setShowNextElement(false);
      }
    }
  }, [form, currentElementIndex, showNextElement]);

  const handleInputChange = (elementId, value) => {
    setUserInputs((prev) => ({ ...prev, [elementId]: value }));
  };

  const handleInputSubmit = async (elementId) => {
    const currentElement = form.elements[currentElementIndex];

    if (currentElement.elementType === "input") {
      await updateInputValue(formId, elementId, userInputs[elementId] || "");

      setUserInputs((prev) => ({ ...prev, [elementId]: "" }));

      // Disable input and send button after submission
      const inputElement = document.querySelector(`input[name="${elementId}"]`);
      const sendButton = document.querySelector(`.sendBtn-${elementId}`);

      if (inputElement) inputElement.classList.add(styles.disabled);
      if (sendButton) sendButton.classList.add(styles.disabled);
    }

    if (!hasStarted) {
      await updateFormAnalytics(
        formId,
        form.analytics.completions,
        form.analytics.views,
        form.analytics.starts + 1
      );
      setHasStarted(true);
    }

    if (currentElementIndex < form.elements.length - 1) {
      setCurrentElementIndex((prev) => prev + 1);
      setShowNextElement(true);
    } else {
      await updateFormAnalytics(
        formId,
        form.analytics.completions + 1,
        form.analytics.views,
        form.analytics.starts
      );
    }
  };

  const handleButtonClick = (elementId) => {
    setClickedButtons((prev) => ({ ...prev, [elementId]: true }));
  };

  const renderElement = (element) => {
    switch (element.elementType) {
      case "bubble":
        return (
          <div className={`${styles.bubble} ${styles.left}`}>
            {element.bubbleType === "Text" && (
              <div className={styles.bubbleTextContainer}>
                <p className={styles.bubbleText}>{element.content}</p>
              </div>
            )}
            {element.bubbleType === "Image" && (
              <img src={element.content} alt="Bubble content" />
            )}
            {element.bubbleType === "Video" && (
              <video src={element.content} controls />
            )}
            {element.bubbleType === "GIF" && (
              <img src={element.content} alt="GIF" />
            )}
          </div>
        );
      case "input":
        return (
          <div className={`${styles.input} ${styles.right}`}>
            {element.inputType === "Button" ? (
              <button
                className={`${styles.inputButton} ${
                  clickedButtons[element._id] ? styles.buttonClicked : ""
                }`}
                onClick={() => handleButtonClick(element._id)}
              >
                {element.value || "Button"}{" "}
              </button>
            ) : element.inputType === "Radio" ? (
              <div className={styles.inputContainer}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <div className={styles.inputRadioContainer} key={value}>
                    <label
                      className={
                        userInputs[element._id] === String(value)
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        handleInputChange(element._id, String(value))
                      }
                    >
                      {value}
                    </label>
                  </div>
                ))}
                <button
                  onClick={() => handleInputSubmit(element._id)}
                  className={`${styles.sendBtn} sendBtn-${element._id}`}
                >
                  <img src={SendICon} alt="Send Icon" />
                </button>
              </div>
            ) : (
              <div className={styles.inputContainer}>
                <input
                  type={element.inputType.toLowerCase()}
                  value={userInputs[element._id] || ""}
                  onChange={(e) =>
                    handleInputChange(element._id, e.target.value)
                  }
                  placeholder={element.label || `Enter ${element.inputType}`}
                  name={element._id}
                />
                <button
                  onClick={() => handleInputSubmit(element._id)}
                  className={`${styles.sendBtn} sendBtn-${element._id}`}
                >
                  <img src={SendICon} alt="Send Icon" />
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className={`${styles.shareFormContainer} ${styles[theme]}`}>
      <div className={styles.elementsContainer}>
        {form.elements.slice(0, currentElementIndex + 1).map((element) => (
          <div key={element._id} className={styles.elementWrapper}>
            {renderElement(element)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShareForm;
