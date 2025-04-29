import mongoose from 'mongoose';
import Organization from './OrganizationModel.js';
 
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  categories: {
    type: [String],
    default: []
  },
  state: {
    type: String,
    enum: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
      'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
      'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
      'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
      'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
      'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry', 'All'
    ],
    default: 'All'
  },
  seoTags: {
    type: [String],
    default: []
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});
 
faqSchema.pre('save', async function (next) {
    try {
      this.updatedAt = new Date();  
      next();
    } catch (err) {
      next(err); 
    }
  });
  
const FAQ = mongoose.model('FAQ', faqSchema);
 
export default FAQ;
