// External imports
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Internal imports
import { serverConfig } from '../../interfaces/env_config';

const protect = (req: Request, res: Response, next: NextFunction): void => {
  // Check the auth header for the token
  const authHeader = req.headers.authorization || undefined;

  try {
    // Handle if no authorization header is present
    // (i.e. no token was provided)
    if (!authHeader) throw Error('Missing authorization header!');

    const decodedToken = jwt.sign({ 'auth-token': authHeader }, serverConfig.API_KEY);
    jwt.verify(decodedToken, serverConfig.API_KEY, (err: any, decoded: any) => {
      const token = decoded['auth-token'].split(' ')[1];
      if (token === process.env.API_KEY) {
        next();
      } else {
        throw Error('Not authorized');
      }
    });
  } catch (e: any) {
    res.status(401).send({
      message: e.message,
    });
  }
};

export default protect;
