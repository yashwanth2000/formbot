import express from "express";
const router = express.Router();
import {
  createFolder,
  getAllFolders,
  deleteFolder,
} from "../controller/folder.controller.js";
import verifyToken from "../utils/verifyToken.js";

router.post("/createFolder", verifyToken, createFolder);
router.get("/getAll", verifyToken, getAllFolders);
router.delete("/deleteFolder/:id", verifyToken, deleteFolder);

export default router;
