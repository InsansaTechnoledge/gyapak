import multer from "multer";
import Authority from "../models/AuthorityModel.js";
import {
  bufferToBase64,
  bufferToBase64Raw,
  isValidImage,
} from "../utils/imageUtils.js";

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (isValidImage(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

export const getStateList = async (req, res) => {
  try {
    const states = await Authority.find(
      { type: "State_Government" },
      {
        _id: 1,
        name: 1,
      }
    );

    // const stateList = states.map(state => state.name);

    res.status(200).json(states);
  } catch (err) {
    console.log(err);
    res.status(400).json("List not available");
  }
};

export const addState = async (req, res) => {
  try {
    let { name } = req.body;
    if (!name)
      return res.status(403).json({ message: "Name of the state is required" });
    let logoBase64 = "";
    if (req.file) {
      logoBase64 = bufferToBase64Raw(req.file.buffer);
    } else {
      return res.status(402).json({ message: "Add image of the state " });
    }

    const newState = new Authority({
      name,
      type: "State_Government",
      logo: logoBase64,
    });
    await newState.save();
    res.status(200).json({ message: `New State ${name} added Succesfully` });
  } catch (err) {
    console.log(err);
    res
      .status(501)
      .json({ message: "something went wrong please try again ", error: err });
  }
};
