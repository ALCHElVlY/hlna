// External imports
import express from 'express';

// Internal imports
import { getDossier } from '../../middleware/dossierController';

const router = express.Router();

// @desc HTTP GET a creature dossier from the database
// @route GET api/dossiers/:creature_name
// @access Public
router.get('/:creature_name', getDossier);

export default router;
