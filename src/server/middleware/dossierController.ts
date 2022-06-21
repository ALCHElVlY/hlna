// External imports
import { Request, Response } from 'express';

// Internal imports
import Dossier from '../database/models/Dossier';

export const getDossier = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { creature_name } = req.params;
    Dossier.findOne({ creature_name })
      .then((data) => res.json(data))
      .catch((e) => console.error(e));
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Server Error' });
  }
};
