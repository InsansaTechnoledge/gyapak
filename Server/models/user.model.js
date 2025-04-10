import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const PurchasedTestSchema = new Schema(
  {
    testId: {
      type: String,
      required: [true, 'course is required'],
    },
    model: {
      type: String,
      enum: ["Seeker", "Planner", "Cracker"]
    }
  },
  {
    _id: false,
  }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name is required'],
      minLength: [2, 'enter a valid name'],
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

    password: {
      type: String,
      select: false, // Exclude password from queries
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      },
    },

    googleId: {
      type: String,
    },

    userRole: {
        type: String,
        enum:['user' , 'admin' , 'contentProvider' , 'proofChecker']
    },

    testsPurchased : {
      type: [PurchasedTestSchema],
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    versionKey: false,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('courseCount').get(function () {
  return this.testsPurchased.length;
});

const User = model('User', userSchema);
export default User;
