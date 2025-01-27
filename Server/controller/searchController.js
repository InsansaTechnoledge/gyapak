import mongoose from "mongoose";
import Organization from "../models/OrganizationModel.js";
import Authority from "../models/AuthorityModel.js";
import Category from "../models/categoryModel.js";

export const search = async (req, res) => {
  try {
    const { query } = req.params;

    // Validate that query is provided
    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Retrieve the database instance
    const db = mongoose.connection.db;

    // Perform searches in all collections
    const authorities = await db
      .collection("authorities")
      .find({ name: { $regex: `\\b${query}\\b`, $options: "i" } })
      .toArray();
    const organizations = await db
      .collection("organizations")
      .find({ abbreviation: { $regex: `\\b${query}\\b`, $options: "i" } })
      .toArray();
    const categories = await db
      .collection("categories")
      .find({ category: { $regex: `\\b${query}\\b`, $options: "i" } })
      .toArray();

    // Return results as separate arrays
    const result = {
      authorities,
      organizations,
      categories,
    };

    // Log and respond with results
    res.status(200).json(result);
  } catch (err) {
    console.error("Error during search:", err);
    res.status(500).json({ message: "An error occurred during search." });
  }

};

export const searchSuggestion = async (req, res) => {
  const userInput = req.query.q || '';
  if (!userInput) return res.json({ suggestions: [] });

  try {
    const regex = new RegExp(`${userInput.split("").join(".*")}`, 'i'); 
    const results = await Promise.all([
      Organization.find({ abbreviation: regex }).limit(5),
      Authority.find({ name: regex }).limit(5),
      Category.find({ category: regex }).limit(5),
    ]);

    // Combine results from all collections
    const suggestions = {
      "organizations": [...results[0]],
      "authorities": [...results[1]],
      "categories": [...results[2]]
    }
    // const suggestions = [...results[0], ...results[1], ...results[2]];
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const searchState = async (req, res) => {
  try {
    const userInput = req.query.q || '';

    if (!userInput) return res.json({ suggestions: [] });

    const regex = new RegExp(`^${userInput}`, 'i'); // Matches input starting with userInput
    const results = await Authority.find({ name: regex }).limit(5);

    // Combine results from all collections
    const suggestions = [...results];

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}