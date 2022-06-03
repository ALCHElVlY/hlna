const express = require('express');
const router = express.Router();

const { getItemData } = require('../../middleware/itemControllers');

// @desc HTTP GET request to retrieve data for a specific item
// @route GET api/items/:name
// @access Public
router.get('/:name', getItemData);

module.exports = router;
