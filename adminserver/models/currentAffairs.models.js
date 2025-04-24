import {Schema , model} from 'mongoose'

const questionSchema = new Schema({
    text: {
      type: String,
      required: true,
      trim: true
    },
    options: {
      type: [String],
      validate: v => Array.isArray(v) && v.length === 4
    },
    answer: {
      type: String,
      required: true
    }
  }, { _id: false });
  

const affairItemSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: [
        'Polity',
        'Economy',
        'International',
        'Science & Tech',
        'Environment',
        'Sports',
        'Awards',
        'Obituaries',
        'Miscellaneous',
      ],
      default: 'Miscellaneous',
    },
    tags: {
      type: [String],
      index: true,
    },
    source: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String, 
    },
    videoUrl: {
      type: String, 
    },
    language: {
      type: String,
      enum: ['en', 'hi'], 
      default: 'en',
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },

    questions: { type: [questionSchema], default: [] }

  }, { _id: false });

const currentAffariSchema = new Schema({
    date:{
        type: Date,
        required : [true , 'date is required'],
        unique: [true , 'duplicate entry of data not allowed']
    },
    month:{
        type: Number,
        min: 1,
        max: 12,
        required: [true , 'month is required']
    },
    year: {
        type: Number,
        required: [true, 'year is required']

    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
      },
      affairs: {
        type: [affairItemSchema],
        default: [],
      },


}, {timestamps : true})

currentAffariSchema.index({ date: 1 });
currentAffariSchema.index({ month: 1, year: 1 });
currentAffariSchema.index({ 'affairs.tags': 1 });
currentAffariSchema.index({ 'affairs.category': 1 });

export const CurrentAffair = model('CurrentAffair', currentAffariSchema);
