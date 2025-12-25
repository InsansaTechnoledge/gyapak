import { Schema, model } from "mongoose";

const ThemeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: false },

    // CSS variable map: "--main-site-color": "124 58 237"
    vars: { type: Object, default: {} },
  },
  { timestamps: true }
);

ThemeSchema.index({ isActive: 1 });

export default model("Theme", ThemeSchema);
