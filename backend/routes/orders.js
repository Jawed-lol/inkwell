const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const order = {
      orderId,
      items: items.map(item => ({
        bookId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      createdAt: new Date(),
    };

    user.orders.push(order);
    user.cart = [];
    await user.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Order creation error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;