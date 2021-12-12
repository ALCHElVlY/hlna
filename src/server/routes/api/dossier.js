const express = require('express');
const router = express.Router();

const {
	getDossier,
} = require('../../middleware/dossierControllers');

// @desc HTTP GET a creature dossier from the database
// @route GET api/dossiers/:creature_name
// @access Public
router.get('/:creature_name', getDossier);

module.exports = router;