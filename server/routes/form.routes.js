import express from "express";
const router = express.Router();
import {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
  updateFormAnalytics,
  updateInputValue,
} from "../controller/form.controller.js";
import verifyToken from "../utils/verifyToken.js";

router.post("/create", verifyToken, createForm);
router.get("/getAll", verifyToken, getAllForms);
router.get("/get/:id", verifyToken, getFormById);
router.put("/update/:id", verifyToken, updateForm);
router.delete("/delete/:id", verifyToken, deleteForm);
router.put("/updateAnalytics/:id", updateFormAnalytics);
router.put('/updateInputValue/:formId/:elementId', updateInputValue);

export default router;
