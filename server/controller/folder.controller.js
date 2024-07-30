import Folder from "../models/folder.model.js";
import errorHandler from "../utils/error.js";

export const createFolder = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(errorHandler(400, "Folder name is required"));
    }
    const newFolder = new Folder({
      name,
      user: req.user.id,
    });
    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (error) {
    next(errorHandler(500, "Failed to create folder"));
  }
};

export const getAllFolders = async (req, res, next) => {
  try {
    const folders = await Folder.find({ user: req.user.id });
    res.status(200).json(folders);
  } catch (error) {
    next(errorHandler(500, "Failed to fetch folders"));
  }
};

export const deleteFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return next(errorHandler(404, "Folder not found"));
    }
    if (folder.user.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized access to the folder"));
    }

    await folder.deleteOne(); // Triggers pre-remove middleware

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Failed to delete folder"));
  }
};
