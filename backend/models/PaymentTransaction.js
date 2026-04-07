const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  txRef: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'NGN',
    trim: true
  },
  status: {
    type: String,
    enum: ['successful', 'failed', 'pending'],
    default: 'successful'
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  customerName: {
    type: String,
    trim: true
  },
  paymentType: {
    type: String,
    trim: true
  },
  processorResponse: {
    type: String,
    trim: true
  },
  gatewayResponse: {
    type: String,
    trim: true
  },
  paidAt: {
    type: Date
  },
  verifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

paymentTransactionSchema.index({ user: 1, paidAt: -1 });
paymentTransactionSchema.index({ book: 1, paidAt: -1 });
paymentTransactionSchema.index({ status: 1, paidAt: -1 });

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
