import mongoose from "mongoose";

const formElementSchema = new mongoose.Schema({
  elementType: {
    type: String,
    enum: ["bubble", "input"],
    required: true,
  },
  bubbleType: {
    type: String,
    enum: ["Text", "Image", "Video", "GIF"],
    required: function () {
      return this.elementType === "bubble";
    },
  },
  inputType: {
    type: String,
    enum: ["Text", "Number", "Email", "Phone", "Date", "Radio", "Button"],
    required: function () {
      return this.elementType === "input";
    },
  },
  content: {
    type: String,
    required: function () {
      return this.elementType === "bubble";
    },
  },
  label: {
    type: String,
  },
  value: mongoose.Schema.Types.Mixed,
  button: {
    text: String,
    action: String,
  },
});

const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    elements: [formElementSchema],
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      trim: true,
      default: null,
    },
    theme: {
      type: String,
      enum: ["light", "dark", "tailBlue"],
      default: "light",
    },
    submissions: [
      {
        submittedAt: { type: Date, default: Date.now },
        data: { type: mongoose.Schema.Types.Mixed },
      },
    ],
    analytics: {
      views: { type: Number, default: 0 },
      starts: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);
export default Form;
