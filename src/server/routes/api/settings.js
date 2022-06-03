const express = require('express');
const router = express.Router();

const {
  createConfiguration,
  deleteConfiguration,
  getConfiguration,
  updateConfiguration,
} = require('../../middleware/configControllers');

// @desc HTTP POST creates a bot configuration document in the database
// @route POST api/settings
// @access Public
router.post('/', createConfiguration);

// @desc HTTP DELETE removes a bot configuration document from the database
// @route DELETE api/settings
// @access Public
router.delete('/', deleteConfiguration);

// @desc HTTP GET a bot configuration document from the database
// @route GET api/settings
// @access Public
router.get('/', getConfiguration);

// @desc HTTP PUT updates a bot configuration document in the database
// @route PUT api/settings/:guild_id
// @access Public
router.put('/:guild_id', updateConfiguration);

module.exports = router;
