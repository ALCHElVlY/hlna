// External imports
import { Request, Response } from 'express';

// Internal imports
import Item from '../database/models/Item';

export const getItemData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.params;
    Item.findOne({ name })
      .then((data) => res.json(data))
      .catch((e) => console.error(e));
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Server Error' });
  }
};
