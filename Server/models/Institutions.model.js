import {Schema , model} from 'mongoose'


const addressSchema = new Schema({
  line1: {
    type: String,
    required: true,
    trim: true,
  },
  line2: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: String,
    required: true,
    match: /^[0-9]{5,6}$/ // pincode validation
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false
    }
  }
}, {
  _id: false
});

const featuresSchema = new Schema({
    canCreateExams :{
        type: Boolean,
        default: false,
    },
    canAccessAnalytics: {
        type: Boolean,
        default: false,
    },
    canHostLiveTest: {
        type: Boolean,
        default: false
    },
    canAddStudentData: {
        type: Boolean,
        default: false
    }
},
{
    _id: false
})

const subscriptionSchema = new Schema({
    plan: { 
        type: String, 
        enum: ['free', 'standard', 'premium'], 
        default: 'free' 
    },
    startDate: { 
        type: Date 
    },
    endDate: { 
        type: Date 
    },
    status: { 
        type: String, 
        enum: ['active', 'cancelled', 'trialing'], 
        default: 'trialing' 
    }
},
{
    _id: false
})

const InstitutionSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [3 , 'name shall be length 3 (minimum) '],
        maxlength: [32, 'maximum lenght exeeds (32)'],
        unique: [true, 'institute by this name already exists']
    },
    email: {
        type: String,
        unique: [true, 'Email already exists'],
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        minLength: [10, 'Enter a valid email'],
        maxLength: [60, 'email length exeeds '],
        validate: {
          validator: function (v) {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
          },
          message: 'Please enter a valid email address',
        },
      },
      phone: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v); // +91-9876543210 or 9876543210
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        maxlength: 15,
        minlength: 10
      },
      logoUrl:{
        type: String
      },
      address : addressSchema,
      website:{
        type: String
      },
      adminUserId:{
        type: Schema.Types.ObjectId,
        ref:'User'
      },
      active:{
        type: Boolean,
        default: true
      },
      features: featuresSchema,
      subscription: subscriptionSchema,

      
}, 
{
    timestamps: true
})

export const Institute = model('Institute' , InstitutionSchema)