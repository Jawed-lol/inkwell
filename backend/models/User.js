const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  cart: [{
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    quantity: { type: Number, default: 1 }
  }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);