import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormContext } from "../../../utils/FormContext.jsx";
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
import styles from "./Flow.module.css";

const Flow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, updateFormData, handleSave, handleShare } =
    useFormContext();
  const [formName, setFormName] = useState(formData?.name || "");
  const [formElements, setFormElements] = useState(formData?.elements || []);
  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const folderId = location.state?.folderId;

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
    inputRadio: 0,
    inputButton: 0,
  });

  useEffect(() => {
    if (
      formData.name !== formName ||
      formData.elements !== formElements ||
      formData.folderId !== folderId
    ) {
      updateFormData({ name: formName, elements: formElements, folderId });
    }
  }, [formName, formElements, folderId, formData, updateFormData]);

  const handleChange = (e) => {
    setFormName(e.target.value);
    setErrors({ ...errors, formName: "" });
  };

  const handleCancel = () => {
    setFormName("");
    setFormElements([]);
    setErrors({});
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
    if (field === "value" && formElements[index].inputType === "Button") {
      updatedElements[index][field] = value;
    } else {
      updatedElements[index][field] = value;
    }
    setFormElements(updatedElements);
    setErrors({ ...errors, [index]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formName.trim()) {
      newErrors.formName = "Form name is required";
    }

    const hasBubble = formElements.some((el) => el.elementType === "bubble");
    const hasInput = formElements.some((el) => el.elementType === "input");

    if (!hasBubble || !hasInput) {
      newErrors.formElements = "At least one bubble and one input are required";
      toast.error("At least one bubble and one input are required", {
        position: "top-right",
        autoClose: 500,
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

  const onSave = async () => {
    if (validateForm()) {
      updateFormData({
        name: formName,
        elements: formElements,
        folderId: folderId || null,
      });
      const savedForm = await handleSave();
      if (savedForm) {
        setIsSaved(true);
        navigate("/home", { state: { formSaved: true } });
      }
    }
  };

  const onShare = () => {
    handleShare();
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
      inputRadio: 0,
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
        <div className={styles.formNameContainer}>
          <input
            type="text"
            value={formName}
            onChange={handleChange}
            placeholder="Enter Form Name"
            className={`${styles.formNameInput} ${
              errors.formName ? styles.errorInput : ""
            }`}
          />
          {errors.formName && (
            <span className={styles.errorMessage}>{errors.formName}</span>
          )}
        </div>
        <nav className={styles.middleButtons}>
          <Link
            className={`${styles.button} ${
              location.pathname === "/flow" ? styles.active : ""
            }`}
          >
            Flow
          </Link>
          <Link
            to="/theme"
            state={{ folderId }}
            className={`${styles.button} ${
              location.pathname === "/theme" ? styles.active : ""
            }`}
          >
            Theme
          </Link>
          <Link
            to="/analytics"
            state={{ folderId }}
            className={`${styles.button} ${
              location.pathname === "/analytics" ? styles.active : ""
            }`}
          >
            Response
          </Link>
        </nav>
        <div className={styles.rightButtons}>
          <button
            className={styles.shareBtn}
            disabled={!isSaved}
            onClick={onShare}
          >
            Share
          </button>
          <button className={styles.saveBtn} onClick={onSave}>
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
                onClick={() => addInputElement("Radio")}
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
                  <div className={styles.elementHeader}>
                    <img
                      src={
                        element.bubbleType === "Text"
                          ? MsgIcon
                          : element.bubbleType === "Image"
                          ? ImgIcon
                          : element.bubbleType === "Video"
                          ? VideoIcon
                          : GifIcon
                      }
                      alt={element.displayLabel}
                      className={styles.elementIcon}
                    />
                    <input
                      type={element.bubbleType === "Text" ? "text" : "url"}
                      placeholder={
                        element.bubbleType === "Text"
                          ? "Click here to edit"
                          : "Click to add URL"
                      }
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
                            <video
                              src={element.content}
                              controls
                              width="100%"
                              height="auto"
                            >
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      )}
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.inputHint}>
                    {element.inputType === "Date"
                      ? "Hint: User will select a date"
                      : element.inputType === "Radio"
                      ? "Hint : User will tap to rate out of 5"
                      : element.inputType === "Button"
                      ? "Hint: User will click this button"
                      : `Hint: User will input ${element.inputType.toLowerCase()} on the form`}
                  </p>
                  <div className={styles.elementHeader}>
                    <img
                      src={
                        element.inputType === "Text"
                          ? TextIcon
                          : element.inputType === "Number"
                          ? NumIcon
                          : element.inputType === "Email"
                          ? EmailIcon
                          : element.inputType === "Phone"
                          ? PhoneIcon
                          : element.inputType === "Date"
                          ? DateIcon
                          : element.inputType === "Range"
                          ? RatingIcon
                          : BtnIcon
                      }
                      alt=""
                      className={styles.elementIcon}
                    />
                    <input
                      type="text"
                      placeholder={
                        element.inputType === "Button"
                          ? "Enter button text"
                          : "Enter placeholder text"
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
                  </div>
                </>
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
