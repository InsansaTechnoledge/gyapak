import {Schema , model} from 'mongoose';

const detailedTestResultSchema = new Schema({
   detailedResult : {
    type: Object,
    required: [true, 'result is required']
   }
})

export const DetailedTestResult = model('DetailedTestResult', detailedTestResultSchema);