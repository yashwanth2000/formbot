import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getFormById,
  updateInputValue,
  updateFormAnalytics,
} from "../../../utils/form";
import styles from "./ShareForm.module.css";

const ShareForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({});
  const [showNextElement, setShowNextElement] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const fetchedForm = await getFormById(formId);
        setForm(fetchedForm);

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
      await updateInputValue(formId, elementId, {
        value: userInputs[elementId] || currentElement.value || "",
      });
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

  const renderElement = (element) => {
    switch (element.elementType) {
      case "bubble":
        return (
          <div className={`${styles.bubble} ${styles.left}`}>
            {element.bubbleType === "Text" && <p>{element.content}</p>}
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
            {element.label && <label>{element.label}</label>}
            {element.inputType === "Button" ? (
              <button onClick={() => handleInputSubmit(element._id)}>
                {element.value || "Button"}{" "}
              </button>
            ) : (
              <>
                <input
                  type={element.inputType.toLowerCase()}
                  value={userInputs[element._id] || ""}
                  onChange={(e) =>
                    handleInputChange(element._id, e.target.value)
                  }
                />
                <button onClick={() => handleInputSubmit(element._id)}>
                  Send
                </button>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div
      className={`${styles.shareFormContainer} ${
        styles[form.theme.toLowerCase().replace(" ", "")]
      }`}
    >
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
