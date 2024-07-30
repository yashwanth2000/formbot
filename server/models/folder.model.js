import mongoose from "mongoose";
import Form from "./form.model.js"; // Ensure correct path to form model

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

folderSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      // Delete all forms associated with this folder
      await Form.deleteMany({ folderId: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Folder = mongoose.model("Folder", folderSchema);
export default Folder;
