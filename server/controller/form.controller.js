import Form from "../models/form.model.js";
import errorHandler from "../utils/error.js";

export const createForm = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return next(errorHandler(400, "Form name is required"));
    }
    const newForm = new Form({
      ...req.body,
      createdBy: req.user.id,
    });
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    if (error.name === "ValidationError") {
      next(errorHandler(400, error.message));
    } else {
      next(errorHandler(500, "Failed to create form"));
    }
  }
};

export const getAllForms = async (req, res, next) => {
  try {
    const forms = await Form.find({ createdBy: req.user.id });
    if (!forms || forms.length === 0) {
      return next(errorHandler(404, "No forms found"));
    }
    res.status(200).json(forms);
  } catch (error) {
    next(errorHandler(500, "Failed to fetch forms"));
  }
};

export const getFormById = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return next(errorHandler(404, "Form not found"));
    }
    if (form.createdBy.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized access to the form"));
    }
    res.status(200).json(form);
  } catch (error) {
    if (error.kind === "ObjectId") {
      next(errorHandler(400, "Invalid form ID"));
    } else {
      next(errorHandler(500, "Failed to fetch form"));
    }
  }
};

export const updateForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return next(errorHandler(404, "Form not found"));
    }
    if (form.createdBy.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized access to the form"));
    }

    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedForm);
  } catch (error) {
    next(errorHandler(500, "Failed to update form"));
  }
};

export const deleteForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return next(errorHandler(404, "Form not found"));
    }
    if (form.createdBy.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized access to the form"));
    }
    await form.deleteOne();
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      next(errorHandler(400, "Invalid form ID"));
    } else {
      next(errorHandler(500, "Failed to delete form"));
    }
  }
};

export const updateFormAnalytics = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const { completions, views, starts } = req.body;
    if (views < 0 || starts < 0 || completions < 0) {
      return res
        .status(400)
        .json({ message: "Analytics values cannot be negative" });
    }

    form.analytics = {
      ...form.analytics,
      ...req.body,
    };

    if (form.analytics.views > 0) {
      form.analytics.completionRate =
        form.analytics.completions / form.analytics.views;
    }

    await form.save();
    res.json(form.analytics);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getFormsByFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const forms = await Form.find({ folderId });
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms by folder:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const submitFormBatch = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const submissionData = req.body;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const newSubmission = {
      submittedAt: new Date(),
      data: submissionData,
    };

    form.submissions.push(newSubmission);
    await form.save();

    res.status(200).json({
      message: "Form submitted successfully",
      submission: newSubmission,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
