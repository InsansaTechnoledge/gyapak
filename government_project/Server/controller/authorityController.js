import Authority from "../models/AuthorityModel.js";
import {convertImageToBase64 }from '../config/imageConversion.js';
import fs from 'fs'
import { fileURLToPath } from 'url';
import {dirname} from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

  const readAuthorityDataFromFile = (filePath) => {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data); 
    } catch (error) {
      throw new Error('Error reading authority data file');
    }
  };

export const saveOrUpdateAuthorities = async (authorityData) => {
  try {
    const authorities = [];
    const errors = []; 

    for (let x of authorityData) {
      const imagePath = path.resolve(__dirname, `../data/AuthorityLogos/${x.name}.png`);
      console.log(imagePath);

      let logo = null; 

      if (fs.existsSync(imagePath)) {
        try {
          logo = await convertImageToBase64(imagePath);  // If image exists, convert to base64
        } catch (imageError) {
          console.log(`Error converting image for ${x.name}: ${imageError.message}`);
          errors.push(`Error converting image for ${x.name}`);
        }
      } else {
        console.log(`Image not found for ${x.name}, logo will be set to null.`);
      }

      let body = await Authority.findOne({ name: x.name });

      if (body) {
        body.logo = logo;  
        console.log(`Updating authority: ${body.name}`);
        await body.save();
      } else {

        body = new Authority({
          name: x.name,
          logo: logo, 
          type: x.type,
        });
        console.log(`Creating new authority: ${body.name}`);
        await body.save();
      }

      authorities.push(body);  
    }

    if (errors.length > 0) {
      console.log("Some authorities had issues with logos:", errors);
    }

    return authorities;
  } catch (error) {
    throw new Error(`Error in saveOrUpdateAuthorities: ${error.message}`);
  }
};

export const createAuthorityFunction = async () => {
  try {
    const filePath = path.resolve(__dirname, '../data/authorityData.json'); 
    const authorityData = readAuthorityDataFromFile(filePath); 
    return await saveOrUpdateAuthorities(authorityData); 
  } catch (error) {
    console.error(`Error in createAuthorityFunction: ${error.message}`);
    throw new Error(error.message);
  }
};


export const createAuthority = async (req, res) => {

try {
    const authorityData  = req.body;  
    const authorities = await saveOrUpdateAuthorities(authorityData);
 
    res.status(201).json(authorities);
  } catch (error) {
    console.error(`Error in createAuthority: ${error.message}`);
    res.status(409).json({ message: error.message });
  }
};

export const updateLogos = async (req,res) => {
try{
  const authorityData = req.body;
  const authorities = await saveOrUpdateAuthorities(authorityData);
    res.status(201).json({ message: 'Logo updated successfully',authorities});
}
catch(error){
  console.error(`Error in updateLogos: ${error.message}`);
  res.status(409).json({ message: error.message });
}

};

