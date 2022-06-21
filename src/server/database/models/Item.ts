// External imports
import { Document, Schema, model as Model } from 'mongoose';

// Define the document interface
export interface IArkItem extends Document {
  name: string;
  description: string;
  image_url: string;
  req_level: number;
  req_engram_points: number;
  ingredient_list: string;
  crafted_in: string;
  experience_gained: number;
}

// Define the schema for the item model
const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
    unique: true,
  },
  req_level: {
    type: Number,
    required: true,
  },
  req_engram_points: {
    type: Number,
    required: true,
  },
  ingredient_list: {
    type: String,
    required: true,
  },
  crafted_in: {
    type: String,
    required: true,
  },
  experience_gained: {
    type: Number,
    required: true,
  },
});

// Export the model
const Item = Model<IArkItem>('item', ItemSchema);
export default Item;
