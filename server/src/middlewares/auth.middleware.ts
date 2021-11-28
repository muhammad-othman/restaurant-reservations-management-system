import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest';

export default async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req?.header('Authorization')?.replace('Bearer ', '') as string;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'reservations-secret') as any;
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error();
    }

    (req as AuthenticatedRequest).token = token;
    (req as AuthenticatedRequest).user = user;
    next();
  } catch (e) {
    return res.status(401).send({ error: 'Please authenticate.' })
  }
}

