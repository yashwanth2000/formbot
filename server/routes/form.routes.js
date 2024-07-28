import express from "express";
const router = express.Router();
import {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
} from "../controller/form.controller.js";
import verifyToken from "../utils/verifyToken.js";

router.post("/create", verifyToken, createForm);
router.get("/getAll", verifyToken, getAllForms);
router.get("/get/:id", verifyToken, getFormById);
router.put("/update/:id", verifyToken, updateForm);
router.delete("/delete/:id", verifyToken, deleteForm);

export default router;