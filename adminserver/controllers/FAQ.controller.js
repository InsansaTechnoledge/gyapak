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

        console.log(query);

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


          console.log(faqs)

          return new APIResponse(200 , faqs , 'fetched successfully').send(res);

    } catch(e) {
        return new APIError(500 , 'something went wrong').send(res);
    }
}

export const postFAQ = async (req, res) => {
    try {
        const { question, answer, categories, state, seoTags, organizationId } = req.body;
    
        if (!question || !answer) {
        return res.status(400).json({ message: 'Question and answer are required.' });
        }
        const newFAQ = new FAQ({
        question,
        answer,
        categories,
        state,
        seoTags,
        organizationId
        });
    
        await newFAQ.save();
        new APIResponse(200, newFAQ, 'FAQ created successfully').send(res);
    } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


export const deleteFAQ = async (req, res) => {
    const { id } = req.params;
    try{
        const faq=await FAQ.findByIdAndDelete(id);
        if(!faq){
            new APIError(404, 'FAQ not found').send(res);
        }
        new APIResponse(200, faq, 'FAQ deleted successfully').send(res);
    }catch(error){
        console.error('Error deleting FAQ:', error);
        new APIError(500, 'Internal server error').send(res);
    };

};
