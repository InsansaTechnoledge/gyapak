import {Schema , model} from 'mongoose';

const resultsPdfSchema = new Schema({
   pdfUrl : {
    type: String,
    required: [true, 'pdfUrl is required']
   }
})

export const ResultPdf = model('resultsPdf', resultsPdfSchema);