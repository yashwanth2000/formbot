import { createContext, useState, useContext, useCallback } from "react";
import { toast } from "react-toastify";
import { createForm } from "../utils/form";
import copy from "copy-to-clipboard";
import PropTypes from "prop-types";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    elements: [],
    theme: "light",
    folderId: null,
  });

  const updateFormData = useCallback((newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const formDataToSend = {
        name: formData.name,
        elements: formData.elements,
        folderId: formData.folderId,
        theme: formData.theme,
      };

      const response = await createForm(formDataToSend);

      if (response && response._id) {
        updateFormData({ ...response });
        toast.success("Form saved successfully", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });
        return response;
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Error saving form", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
    }
    return null;
  }, [formData, updateFormData]);

  const handleShare = useCallback(() => {
    if (formData._id) {
      const url = `${import.meta.env.VITE_SHARE_URL}/share/${formData._id}`;
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
    } else {
      toast.error("Please save the form before sharing", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
    }
  }, [formData._id]);

  const clearFormData = useCallback(() => {
    setFormData({
      name: "",
      elements: [],
      theme: "light",
      folderId: null,
    });
  }, []);

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        handleSave,
        handleShare,
        clearFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);

FormProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
