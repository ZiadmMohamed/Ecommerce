import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    couponCode: { type: String, required: true },
    couponAmount: { type: Number, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPercentage: { type: Boolean, default: false },
    isFixedAmount: { type: Boolean, default: false },
    couponAssignedToUsers: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      maxCount: { type: Number, required: true },
      numberOfUsage: { type: Number, required: true }
    }]
  });
  
  const Coupon = mongoose.model('Coupon', couponSchema);
  