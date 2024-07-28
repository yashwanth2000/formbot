import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MsgIcon from "../../../assets/msgIcon.png";
import ImgIcon from "../../../assets/imageIcon.png";
import VideoIcon from "../../../assets/videoIcon.png";
import GifIcon from "../../../assets/gifIcon.png";
import TextIcon from "../../../assets/textIcon.png";
import NumIcon from "../../../assets/numberIcon.png";
import EmailIcon from "../../../assets/emailIcon.png";
import PhoneIcon from "../../../assets/phoneIcon.png";
import DateIcon from "../../../assets/dateIcon.png";
import RatingIcon from "../../../assets/ratingIcon.png";
import BtnIcon from "../../../assets/btnIcon.png";
import FlagIcon from "../../../assets/flagIcon.png";
import CancelImg from "../../../assets/cancel.png";
import DeleteImg from "../../../assets/delete.png";
import { toast, ToastContainer } from "react-toastify";
import { createForm } from "../../../utils/form";
import styles from "./Flow.module.css";

const Flow = () => {
  const navigate = useNavigate();
  const [formName, setFormName] = useState("");
  const [formElements, setFormElements] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  const [elementCounts, setElementCounts] = useState({
    text: 0,
    image: 0,
    video: 0,
    gif: 0,
    inputText: 0,
    inputNumber: 0,
    inputEmail: 0,
    inputPhone: 0,
    inputDate: 0,
    inputRange: 0,
    inputButton: 0,
  });

  const handleChange = (e) => {
    setFormName(e.target.value);
    setErrors({ ...errors, formName: "" });
  };

  const handleCancel = () => {
    setFormName("");
    navigate("/home");
  };

  const addBubbleElement = (subType) => {
    const countKey = subType.toLowerCase();
    setElementCounts((prevCounts) => ({
      ...prevCounts,
      [countKey]: prevCounts[countKey] + 1,
    }));

    const newElement = {
      elementType: "bubble",
      bubbleType: subType,
      content: "",
      displayLabel: `${subType} ${elementCounts[countKey] + 1}`,
    };
    setFormElements([...formElements, newElement]);
    setErrors({ ...errors, [formElements.length]: "" });
  };

  const addInputElement = (subType) => {
    const countKey = `input${subType}`;
    setElementCounts((prevCounts) => ({
      ...prevCounts,
      [countKey]: prevCounts[countKey] + 1,
    }));

    const newElement = {
      elementType: "input",
      inputType: subType,
      displayLabel: `Input ${subType} ${elementCounts[countKey] + 1}`,
      value: subType === "Button" ? "" : undefined,
    };
    setFormElements([...formElements, newElement]);
    setErrors({ ...errors, [formElements.length]: "" });
  };

  const updateElement = (index, field, value) => {
    const updatedElements = [...formElements];
    updatedElements[index][field] = value;
    setFormElements(updatedElements);
    setErrors({ ...errors, [index]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formName.trim()) {
      newErrors.formName = "Form name is required";
    }
    if (formElements.length === 0) {
      newErrors.formElements = "Form elements are required";
      toast.error("Form elements are required", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
    }
    formElements.forEach((element, index) => {
      if (element.elementType === "bubble" && !element.content.trim()) {
        newErrors[index] = "Required Field";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const formData = {
          name: formName,
          elements: formElements.map((element) => {
            if (element.elementType === "bubble") {
              return {
                elementType: element.elementType,
                bubbleType: element.bubbleType,
                content: element.content,
              };
            } else {
              return {
                elementType: element.elementType,
                inputType: element.inputType,
                label: element.label,
                value: element.inputType === "Button" ? element.value : "",
              };
            }
          }),
        };

        const response = await createForm(formData);
        console.log("Form saved successfully:", response);

        if (response) {
          setIsSaved(true);
          setFormName("");
          setFormElements([]);
          navigate("/home", { state: { saved: true } });
        }
      } catch (error) {
        console.error("Error saving form:", error);
        toast.error("Error saving form", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });
      }
    }
  };

  const handleDelete = (index) => {
    const elementType = formElements[index].elementType;
    const subType =
      elementType === "bubble"
        ? formElements[index].bubbleType
        : formElements[index].inputType;
    const countKey =
      elementType === "bubble" ? subType.toLowerCase() : `input${subType}`;

    // Decrement the count for the specific element type
    setElementCounts((prevCounts) => {
      const newCount = prevCounts[countKey] > 0 ? prevCounts[countKey] - 1 : 0;
      return { ...prevCounts, [countKey]: newCount };
    });

    const updatedElements = formElements.filter((_, i) => i !== index);

    // Create a temporary object to track counts for each type
    const tempCounts = {
      text: 0,
      image: 0,
      video: 0,
      gif: 0,
      inputText: 0,
      inputNumber: 0,
      inputEmail: 0,
      inputPhone: 0,
      inputDate: 0,
      inputRange: 0,
      inputButton: 0,
    };

    // Update the labels of the remaining elements
    const newElements = updatedElements.map((element) => {
      const currentCountKey =
        element.elementType === "bubble"
          ? element.bubbleType.toLowerCase()
          : `input${element.inputType}`;

      tempCounts[currentCountKey] += 1;

      const newLabel = `${
        element.elementType === "bubble"
          ? element.bubbleType
          : `Input ${element.inputType}`
      } ${tempCounts[currentCountKey]}`;

      return { ...element, displayLabel: newLabel };
    });

    setFormElements(newElements);
  };

  return (
    <div className={styles.flowContainer}>
      <header className={styles.header}>
        <input
          type="text"
          value={formName}
          onChange={handleChange}
          placeholder="Enter Form Name"
          className={styles.formNameInput}
        />
        {errors.formName && (
          <span className={styles.error}>{errors.formName}</span>
        )}
        <nav className={styles.middleButtons}>
          <Link className={styles.button}>Flow</Link>
          <Link to="/theme" className={styles.button}>
            Theme
          </Link>
          <Link to="/analytics" className={styles.button}>
            Response
          </Link>
        </nav>
        <div className={styles.rightButtons}>
          <button className={styles.shareBtn} disabled={!isSaved}>
            Share
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            Save
          </button>
          <img
            src={CancelImg}
            alt="Cancel"
            className={styles.cancelIcon}
            onClick={handleCancel}
          />
        </div>
      </header>

      <main className={styles.content}>
        <aside className={styles.formSideBar}>
          <section className={styles.bubbleContainer}>
            <h3 className={styles.bubbleHeader}>Bubbles</h3>
            <div className={styles.bubbleButtons}>
              <div
                className={styles.bubble}
                onClick={() => addBubbleElement("Text")}
              >
                <img src={MsgIcon} alt="Message Icon" />
                <button className={styles.bubbleButton}>Text</button>
              </div>
              <div
                className={styles.bubble}
                onClick={() => addBubbleElement("Image")}
              >
                <img src={ImgIcon} alt="Image Icon" />
                <button className={styles.bubbleButton}>Image</button>
              </div>
              <div
                className={styles.bubble}
                onClick={() => addBubbleElement("Video")}
              >
                <img src={VideoIcon} alt="Video Icon" />
                <button className={styles.bubbleButton}>Video</button>
              </div>
              <div
                className={styles.bubble}
                onClick={() => addBubbleElement("GIF")}
              >
                <img src={GifIcon} alt="GIF Icon" />
                <button className={styles.bubbleButton}>GIF</button>
              </div>
            </div>
          </section>

          <section className={styles.inputContainer}>
            <h3 className={styles.inputHeader}>Input</h3>
            <div className={styles.inputButtons}>
              <div
                className={styles.bubble}
                onClick={() => addInputElement("Text")}
              >
                <img src={TextIcon} alt="Text Icon" />
                <button className={styles.bubbleButton}>Text</button>
              </div>
              <div
                className={styles.bubble}
                onClick={() => addInputElement("Number")}
              >
                <img src={NumIcon} alt="Number Icon" />
                <button className={styles.bubbleButton}>Number</button>
              </div>
              <div
                className={styles.bubble}
                onClick={() => addInputElement("Email")}
              >
                <img src={EmailIcon} alt="Email Icon" />
                <button className={styles.bubbleButton}>Email</button>
              </div>
              <div
                className={styles.bubble}
                onClick={() => addInputElement("Phone")}
              >
                <img src={PhoneIcon} alt="Phone Icon" />
                <button className={styles.bubbleButton}>Phone</button>
              </div>
              <div
                className={styles.bubble}
                onClick={() => addInputElement("Date")}
              >
                <img src={DateIcon} alt="Date Icon" />
                <button className={styles.bubbleButton}>Date</button>
              </div>
              <div
                className={styles.bubble}
                onClick={() => addInputElement("Range")}
              >
                <img src={RatingIcon} alt="Rating Icon" />
                <button className={styles.bubbleButton}>Rating</button>
              </div>
              <div
                className={styles.bubble}
                onClick={() => addInputElement("Button")}
              >
                <img src={BtnIcon} alt="Button Icon" />
                <button className={styles.bubbleButton}>Buttons</button>
              </div>
            </div>
          </section>
        </aside>

        <div className={styles.previewContainer}>
          <div className={styles.previewHeader}>
            <img src={FlagIcon} alt="Start Flag Icon" />
            <h2>Start</h2>
          </div>
          {formElements.map((element, index) => (
            <div key={index} className={styles.formElement}>
              <div className={styles.deleteIcon}>
                <img
                  src={DeleteImg}
                  alt="Delete"
                  onClick={() => handleDelete(index)}
                />
              </div>
              <h4>{element.displayLabel}</h4>
              {element.elementType === "bubble" ? (
                <>
                  <input
                    type={element.bubbleType === "Text" ? "text" : "url"}
                    placeholder={`Enter ${element.bubbleType} content`}
                    value={element.content}
                    onChange={(e) =>
                      updateElement(index, "content", e.target.value)
                    }
                  />
                  {(element.bubbleType === "Image" ||
                    element.bubbleType === "GIF" ||
                    element.bubbleType === "Video") &&
                    element.content && (
                      <div className={styles.preview}>
                        {element.bubbleType === "Image" && (
                          <img src={element.content} alt="Preview" />
                        )}
                        {element.bubbleType === "GIF" && (
                          <img src={element.content} alt="GIF Preview" />
                        )}
                        {element.bubbleType === "Video" && (
                          <video src={element.content} controls />
                        )}
                      </div>
                    )}
                </>
              ) : (
                <input
                  type="text"
                  placeholder={
                    element.inputType === "Button"
                      ? "Enter button text"
                      : "Enter placeholder"
                  }
                  value={
                    element.inputType === "Button"
                      ? element.value
                      : element.label
                  }
                  onChange={(e) =>
                    updateElement(
                      index,
                      element.inputType === "Button" ? "value" : "label",
                      e.target.value
                    )
                  }
                />
              )}
              {errors[index] && (
                <span className={styles.error}>{errors[index]}</span>
              )}
            </div>
          ))}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default Flow;
