const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  guild_id: {
    type: String,
    required: true,
  },
  buyer: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  seller: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  order_status: {
    type: String,
    required: true,
  },
  purchased_items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  payment_method: [
    {
      type: String,
      required: true,
    },
  ],
});

const Order = mongoose.model('order', OrderSchema);
module.exports = Order;
