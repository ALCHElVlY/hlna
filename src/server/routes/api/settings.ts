// External imports
import express from 'express';

// Internal imports
import {
    createConfiguration,
    deleteConfiguration,
    getConfiguration,
    updateConfiguration,
  } from '../../middleware/configController';

const router = express.Router();

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

export default router;
