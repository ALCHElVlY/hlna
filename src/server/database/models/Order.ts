// External imports
import { Document, Schema, model as Model } from 'mongoose';

// Define the document interface
export interface IOrder extends Document {
  guild_id: string;
  buyer: object;
  seller: object;
  order_status: string;
  purchased_items: object[];
  payment_method: object[];
}

// Define the schema for the order model
const OrderSchema = new Schema({
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

// Export the model
const Order = Model<IOrder>('order', OrderSchema);
export default Order;
