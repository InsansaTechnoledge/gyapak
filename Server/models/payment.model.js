import mongoose, { Schema, model } from 'mongoose';

const discountSchema = new mongoose.Schema({
  name: String,
  codeId: {
    type: String
    // You can use ObjectId and ref here if needed
  },
  amount: Number
}, { _id: false }); 


const PaymentSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now(),
      index: true,
    },

    receipt: {
      type: String,
      required: true,
      unique: true,
    },

    testId: {
      type: [String],
      validate: {
        validator: function (array) {
          return array.length > 0;
        },
        message: 'At least one exam must be specified',
      },
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    paymentMethod: {
      type: String,
      // required: true,
    },

    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
      default: 'INR',
    },

    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },

    transactionId: {
      type: String,
      sparse: true,
      index: true,
    },

    status: {
      type: String,
      required: true,
      default: 'pending',
      index: true,
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            'pending',
            'processing',
            'completed',
            'failed',
            'refunded',
            'partially_refunded',
            'disputed',
          ],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],

    discount: [discountSchema],

    tax: {
      rate: Number,
      amount: Number,
    },

    subtotal: {
      type: Number,
      // required: true,
    },

    finalTotal:{
      type: Number,
      // required: true,
    }

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for common queries
PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ date: 1, status: 1 });

// Pre-save hook to update status history
PaymentSchema.pre('save', function (next) {
  // If status changed, add to status history
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Status updated',
    });
  }
  next();
});

// Instance methods
PaymentSchema.methods = {

  // Calculate total amount (including taxes, less discounts)
  calculateTotal() {
    let total = this.subtotal;

    // Add tax if exists
    if (this.tax && this.tax.amount) {
      total += this.tax.amount;
    }

    // Subtract discount if exists
    if (this.discount && this.discount.amount) {
      total -= this.discount.amount;
    }

    return total;
  },
};

const Payment = model('Payment', PaymentSchema);
export default Payment;
