import e from "express";
import { Institute } from "../../models/Institutions.model.js";
import { APIError } from "../../Utility/ApiError.js"
import { APIResponse } from "../../Utility/ApiResponse.js";

export const createInstitute = async (req , res) => {
    try{
        const data = req.body;

        const existing = await Institute.findOne({ $or : [{email: data.email}, {name: data.name}]})

        if(existing) return new APIError(400 , [e.message , 'institute already exists']).send(res)

        const institute = await Institute.create(data)

        return new APIResponse(200, institute , 'your institute registered succesfully').send(res)

    } catch (e) {
        return new APIError(500 , [e.message , 'error registering your institute ']).send(res)
    }
}

export const getAllInstitute = async (req , res) => {
    try{
        const institiute = await Institute.find().sort({createdAt: -1});
        return new APIResponse(200 , institiute , 'all fetched').send(res);

    } catch(e) {
        return new APIError(500 , [e.message, 'error fetching all institute']).send(res)
    }
}

export const getInstituteById = async (req, res) => {
    try{

        const {id} = req.params
        
        const institute = Institute.findById(id)
        if (!institute) {
            return new APIError(404, ['Institute not found']).send(res);
        }

        return new APIResponse(200, institute, 'Institute fetched').send(res);

    } catch(e) {
        return new APIError(500 , [e.message, 'error fetching institute']).send(res)

    }
}

export const updateInstitute = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      const institute = await Institute.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
  
      if (!institute) {
        return new APIError(404, ['Institute not found']).send(res);
      }
  
      return new APIResponse(200, institute, 'Institute updated successfully').send(res);
    } catch (err) {
      console.error('❌ Error updating institute:', err);
      return new APIError(500, [err.message || 'Internal server error']).send(res);
    }
  };

  export const deleteInstitute = async (req, res) => {
    try {
      const { id } = req.params;
  
      const institute = await Institute.findByIdAndDelete(id);
  
      if (!institute) {
        return new APIError(404, ['Institute not found']).send(res);
      }
  
      return new APIResponse(200, institute, 'Institute deleted successfully').send(res);
    } catch (err) {
      console.error('❌ Error deleting institute:', err);
      return new APIError(500, [err.message || 'Internal server error']).send(res);
    }
  };