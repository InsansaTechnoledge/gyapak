import { Institute } from "../../models/Institutions.model.js";
import { APIError } from "../../Utility/ApiError.js"
import { APIResponse } from "../../Utility/ApiResponse.js";
import { getGeoLocationFromIp } from "../../Utility/geoLocation/getGeoLocationFromIp.js";

export const loginInstitue = async (req, res) => {
  try {

    const rememberMeBoolean = req.body.rememberMe;

    if (rememberMeBoolean) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
      req.session.cookie.maxAge = 1 * 24 * 60 * 60 * 1000;
    }

    
    const institiute = await Institute.findByIdAndUpdate(
      req.user._id,
      { new: true }
    );

    return new APIResponse(200, { institiute }, 'user loggedIn successfully').send(res);
  } catch (e) {
    return new APIError(500, [e.message]).send(res);
  }
}

export const createInstitute = async (req, res) => {
    try {
      const data = req.body;
  
      // Get client's IP
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  
      // Fetch coordinates
      const location = await getGeoLocationFromIp(ip);
      
  
      if (location) {
        data.address = {
          ...data.address,
          location
        };
      }
  
      const existing = await Institute.findOne({
        $or: [{ email: data.email }, { name: data.name }]
      });
  
      if (existing) {
        return new APIError(409, ['Institute already exists']).send(res);
      }
  
      const institute = await Institute.create(data);
      return new APIResponse(201, institute, 'Institute created successfully').send(res);
    } catch (err) {
      console.error('❌ Error creating institute:', err.message);
      return new APIError(500, [err.message || 'Internal server error']).send(res);
    }
  };


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

  export const getCurrentLoggedInInstitiute = (req , res) => {
      return new APIResponse(200 , req.user , 'Institute fetched successfully').send(res)
  }

  export const logoutInstitute = (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return new APIError(500, ['Logout failed']).send(res);
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return new APIError(500, ['Session destroy failed']).send(res);
        }
        res.clearCookie('connect.sid');
        return new APIResponse(200, null, 'Institute logged out successfully').send(res);
      });
    });
  };
  