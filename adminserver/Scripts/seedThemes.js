require("dotenv").config();
import { connect } from "mongoose";
import { findOneAndUpdate, updateMany } from "../models/Theme.js";

const defaultTheme = {
  name: "Default Purple",
  slug: "default",
  isActive: true,
  vars: {
    "--main-nav-bar-color": "124 58 237",
    "--main-footer-from": "17 24 39",
    "--main-footer-to": "0 0 0",

    "--main-site-color": "124 58 237",
    "--main-site-color-hover": "109 40 217",
    "--main-site-color-2": "168 85 247",

    "--light-site-color": "243 232 255",
    "--light-site-color-2": "233 213 255",
    "--light-site-color-3": "250 245 255",
    "--light-site-color-4": "216 180 254",
    "--light-site-color-5": "192 132 252",

    "--main-site-text-color": "124 58 237",
    "--main-site-text-color-2": "168 85 247",
    "--secondary-site-text-color": "255 255 255",

    "--main-site-border-color": "243 232 255",
    "--main-site-border-color-2": "233 213 255",
    "--main-site-border-color-3": "216 180 254",
    "--main-site-border-color-4": "168 85 247",

    "--main-dark-border-color": "91 33 182",
    "--main-dark-border-color-2": "124 58 237",

    "--utility-site-color": "15 23 42",
    "--utility-secondary-color": "71 85 105",
    "--utility-secondary-color-2": "148 163 184",
    "--utility-scondary-color-3": "241 245 249",

    "--support-component-bg-color": "251 191 36",
    "--support-component-bg-color-green": "220 252 231",

    "--main-site-text-error-color": "220 38 38",
  },
};

const christmasTheme = {
  name: "Christmas",
  slug: "christmas",
  isActive: false,
  vars: {
    "--main-nav-bar-color": "185 28 28",
    "--main-site-color": "185 28 28",
    "--main-site-color-hover": "153 27 27",
    "--main-site-color-2": "22 163 74",

    "--light-site-color": "255 255 255",
    "--light-site-color-2": "254 242 242",
    "--light-site-color-3": "240 253 244",
    "--light-site-color-4": "254 226 226",
    "--light-site-color-5": "220 252 231",

    "--main-site-text-color": "185 28 28",
    "--main-site-text-color-2": "22 163 74",
    "--secondary-site-text-color": "255 255 255",

    "--main-site-border-color": "254 226 226",
    "--main-site-border-color-2": "220 252 231",
    "--main-site-border-color-3": "252 165 165",
    "--main-site-border-color-4": "134 239 172",

    "--main-dark-border-color": "127 29 29",
    "--main-dark-border-color-2": "21 128 61",

    "--utility-site-color": "15 23 42",
    "--utility-secondary-color": "51 65 85",
    "--utility-secondary-color-2": "100 116 139",
    "--utility-scondary-color-3": "241 245 249",

    "--main-footer-from": "17 24 39",
    "--main-footer-to": "2 6 23",

    "--support-component-bg-color": "250 204 21",
    "--support-component-bg-color-green": "220 252 231",
  },
};

(async () => {
  await connect(process.env.MONGO_URI);

  // ensure only one active
  await updateMany({}, { $set: { isActive: false } });

  await findOneAndUpdate({ slug: "default" }, defaultTheme, { upsert: true });
  await findOneAndUpdate({ slug: "christmas" }, christmasTheme, { upsert: true });

  console.log("Seeded themes");
  process.exit(0);
})();
