const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  cart: [
    {
      slug: { type: String, required: true },  // Changed from bookSlug to slug
      quantity: { type: Number, default: 1 },
    },
  ],
  orders: [
    {
      orderId: { type: String, required: true },
      items: [
        {
          bookSlug: { type: String, required: true },
          quantity: { type: Number, required: true },
          price: { type: Number, required: true },
        },
      ],
      total: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { versionKey: false });

module.exports = mongoose.model('User', UserSchema);