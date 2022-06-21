// External imports
import express from 'express';

// Internal imports
import { getItemData } from '../../middleware/itemController';

const router = express.Router();

// @desc HTTP GET request to retrieve data for a specific item
// @route GET api/items/:name
// @access Public
router.get('/:name', getItemData);

export default router;
