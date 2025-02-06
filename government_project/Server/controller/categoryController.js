import Category from '../models/CategoryModel.js'
import {convertImageToBase64 }from '../config/imageConversion.js';
import fs from 'fs'
import { fileURLToPath } from 'url';
import {dirname} from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createOrUpadateCategory = async (names) => {
  try {
    const categories = [];

    for (let name of names) {
      const imagePath = path.resolve(__dirname, `../data/CategoryLogos/${name}.png`);
      console.log(`Processing category: ${name}, logo path: ${imagePath}`);
      let logo = null;

      if (fs.existsSync(imagePath)) {
        try{
        logo = await convertImageToBase64(imagePath);
        }catch(error){
          console.log(`Error in convertImageToBase64: ${error.message}`);
        }
      }
      else{
        console.log(`Logo not found for category: ${name}, setting logo to null.`);
      }

      let categoryItem = await Category.findOne({ category: name });

      if (categoryItem) {
        categoryItem.logo = logo;
        await categoryItem.save();
        console.log(`Category: ${name} updated successfully.`);
      } else {
        
        categoryItem = new Category({
          category: name,
          logo: logo
        });
        await categoryItem.save();
        console.log(`Category: ${name} created successfully.`);
      }

      categories.push(categoryItem);
    }
    return categories;
  } catch (error) {
    console.log(`Error in createOrUpdateCategories: ${error.message}`);
    throw new Error(`Error in createOrUpdateCategories: ${error.message}`);
  }
};

export const CreateCategory = async (req, res) => {
    try {
      const { names } = req.body;  // names is an array of category names
      if (!Array.isArray(names) || names.length === 0) {
        return res.status(400).json({ error: "Invalid input. 'names' should be a non-empty array." });
      }
      const categories = await createOrUpadateCategory(names);
      res.status(201).json(categories);
    } catch (error) {
      console.error(`CreateCategory Error: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
};

export const createCategoryFunction=async()=>{
  try{
    const filePath=path.resolve(__dirname,`../data/categoryData.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`Category data file not found at path: ${filePath}`);
      return [];
    }
    const data=fs.readFileSync(filePath,'utf-8');
    const categories=await createOrUpadateCategory(JSON.parse(data).names);
    console.log("Categories processed successfully from file.");
    return categories;
  }catch(error){
    console.error(`Error in createCategoryFunction: ${error.message}`);
    console.log(error);
  }
}


 