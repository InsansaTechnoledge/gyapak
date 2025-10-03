import mongoose from "mongoose";
if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
  }

const QuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true
    },
    options:{
        type: [String],
        required: true,
    },
    correctAnswer:{
        type: Number,
        required: true
    },
    explanation:{
        type: String,
        required: false,
        default: ''
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    lastUsed:{
        type: Date,
        default: Date.now
    },
    difficulty:{
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    category:{
        type: String,
        default: 'Government'
    },
    year:{
        type: String,
       default: ''
    }
});

const Question = mongoose.model('Question', QuestionSchema);
export default Question;