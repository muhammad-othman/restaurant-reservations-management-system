import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest';

export const hasRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as AuthenticatedRequest).user;
  if (!user.restaurant) return res.status(404).send('User does not have a restaurant');
  next();
}

export const hasNoRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as AuthenticatedRequest).user;
  if (user.restaurant) return res.status(400).send('User already has a restaurant');
  next();
}

