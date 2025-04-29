import { APIError } from "../../Server/Utility/ApiError.js";
import { APIResponse } from "../../Server/Utility/ApiResponse.js";
import FAQ from "../models/FAQ.model.js";

export const getAllFAQs = async (req , res) => {

    try{
        const {state, category , seoTags} = req.query
        
        const query = {}

        if(state && state !== 'All') {
            query.state = state
        }

        if(category) {
            query.category = category
        }

        if(seoTags) {
            query.seoTags = seoTags
        }

        const faqs = await FAQ.find(query).sort({ createdAt: -1 });

        return new APIResponse(200 , faqs , 'fetched successfully').send(res);
    
    } catch(e) {
        return new APIError(500 , 'something went wrong').send(res);
    }

}

export const getFAQsFromOrganization = async (req , res) => {
    try{
        const {orgId } = req.params;
        const { state, category, seoTag } = req.query;

        const query = {
            organizationId : orgId
        }

        if (state && state !== 'All') {
            query.state = state;
          }
      
          if (category) {
            query.categories = category;
          }
      
          if (seoTag) {
            query.seoTags = seoTag;
          }

          const faqs = await FAQ.find(query).sort({ createdAt: -1 });

          return new APIResponse(200 , faqs , 'fetched successfully').send(res);

    } catch(e) {
        return new APIError(500 , 'something went wrong').send(res);
    }
}