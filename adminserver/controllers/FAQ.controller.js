import FAQ from "../models/FAQ.model.js";
import { APIError } from "../utils/ApiError.js";
import { APIResponse } from "../utils/ApiResponse.js";

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