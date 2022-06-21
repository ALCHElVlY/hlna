// External imports
import { Document, Schema, model as Model } from 'mongoose';

// Define the document interface
export interface IDossier extends Document {
  creature_name: string;
  base_cost: number;
  per_level_cost: number;
};

// Define the schema for the dossier model
const DossierSchema = new Schema({
  creature_name: {
    type: String,
    required: true,
    unique: true,
  },
  base_cost: {
    type: Number,
    required: true,
  },
  per_level_cost: {
    type: Number,
    required: true,
  },
});

// Export the model
const Dossier = Model<IDossier>('dossier', DossierSchema);
export default Dossier;
