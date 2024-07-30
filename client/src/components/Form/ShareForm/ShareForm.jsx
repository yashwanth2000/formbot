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
  const [submittedInputs, setSubmittedInputs] = useState({});
  const [selectedRadios, setSelectedRadios] = useState({});
  const [inputErrors, setInputErrors] = useState({});

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

  const handleInputChange = (elementId, value, inputType) => {
    let errorMessage = "";

    setInputErrors((prev) => ({
      ...prev,
      [elementId]: errorMessage,
    }));

    setUserInputs((prev) => ({ ...prev, [elementId]: value }));

    if (inputType === "Radio") {
      setSelectedRadios((prev) => ({
        ...prev,
        [elementId]: value,
      }));
    }
  };

  const handleInputSubmit = async (elementId) => {
    const currentElement = form.elements[currentElementIndex];

    if (currentElement.elementType === "input" && !submittedInputs[elementId]) {
      if (!userInputs[elementId] || userInputs[elementId].trim() === "") {
        setInputErrors((prev) => ({
          ...prev,
          [elementId]: "This field cannot be empty",
        }));
        return;
      }

      if (
        currentElement.inputType === "Email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInputs[elementId])
      ) {
        setInputErrors((prev) => ({
          ...prev,
          [elementId]: "Please enter a valid email address.",
        }));
        return;
      }

      if (
        currentElement.inputType === "Phone" &&
        !/^\d{10,}$/.test(userInputs[elementId])
      ) {
        setInputErrors((prev) => ({
          ...prev,
          [elementId]:
            "Please enter a valid phone number (at least 10 digits).",
        }));
        return;
      }

      setInputErrors((prev) => ({ ...prev, [elementId]: "" }));

      await updateInputValue(formId, elementId, userInputs[elementId]);

      setSubmittedInputs((prev) => ({
        ...prev,
        [elementId]: userInputs[elementId],
      }));

      if (currentElement.inputType === "Radio") {
        setSelectedRadios((prev) => ({
          ...prev,
          [elementId]: userInputs[elementId],
        }));
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
    }
  };

  const handleButtonClick = (elementId) => {
    if (clickedButtons[elementId]) return;

    setClickedButtons((prev) => ({ ...prev, [elementId]: true }));

    if (currentElementIndex < form.elements.length - 1) {
      setCurrentElementIndex((prev) => prev + 1);
      setShowNextElement(true);
    } else {
      updateFormAnalytics(
        formId,
        form.analytics.completions + 1,
        form.analytics.views,
        form.analytics.starts
      );
    }
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
                disabled={!!clickedButtons[element._id]}
              >
                {element.value || "Button"}{" "}
              </button>
            ) : element.inputType === "Radio" ? (
              <div className={styles.inputContainer}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <div className={styles.inputRadioContainer} key={value}>
                    <label
                      className={`${styles.radioLabel} ${
                        selectedRadios[element._id] === String(value)
                          ? styles.selectedRadio
                          : ""
                      }`}
                      onClick={() => {
                        if (!submittedInputs[element._id]) {
                          handleInputChange(
                            element._id,
                            String(value),
                            element.inputType
                          );
                        }
                      }}
                    >
                      {value}
                    </label>
                  </div>
                ))}
                <button
                  onClick={() => handleInputSubmit(element._id)}
                  className={`${styles.sendBtn} sendBtn-${element._id} ${
                    submittedInputs[element._id] ? styles.sentBtn : ""
                  }`}
                  disabled={!!submittedInputs[element._id]}
                >
                  <img src={SendICon} alt="Send Icon" />
                </button>
              </div>
            ) : (
              <div className={styles.inputContainer}>
                <>
                  <input
                    type={element.inputType.toLowerCase()}
                    value={
                      submittedInputs[element._id] ||
                      userInputs[element._id] ||
                      ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        element._id,
                        e.target.value,
                        element.inputType
                      )
                    }
                    placeholder={element.label || `Enter ${element.inputType}`}
                    name={element._id}
                    disabled={!!submittedInputs[element._id]}
                    className={
                      submittedInputs[element._id] ? styles.submittedInput : ""
                    }
                  />
                  <button
                    onClick={() => handleInputSubmit(element._id)}
                    className={`${styles.sendBtn} sendBtn-${element._id} ${
                      submittedInputs[element._id] ? styles.sentBtn : ""
                    }`}
                    disabled={!!submittedInputs[element._id]}
                  >
                    <img src={SendICon} alt="Send Icon" />
                  </button>
                </>
                <div className={styles.errorMessageContainer}>
                  {inputErrors[element._id] && (
                    <span className={styles.errorMessage}>
                      {inputErrors[element._id]}
                    </span>
                  )}
                </div>
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
