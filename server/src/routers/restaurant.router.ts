import { Request, Response, Router } from "express";
import auth from "../middlewares/auth.middleware";
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest';
import Restaurant from "../models/restaurant.model";

const router = Router();

const getRestaurant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = (req as AuthenticatedRequest).user;
  if (!user.restaurant) return res.status(404).send('User does not have a restaurant');
  const restaurant = await Restaurant.findById((req as AuthenticatedRequest).user.restaurant).populate({
    path: 'tables'
  });
  if (!restaurant) return res.status(404).send('User does not have a restaurant');

  return res.send(restaurant);
};

const createRestaurant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = (req as AuthenticatedRequest).user;
  if (user.restaurant) return res.status(400).send('User already has a restaurant');

  const restaurant = new Restaurant({
    name: req.body.name,
    manager: user._id,
  });

  try {
    await restaurant.save();
    await user.updateOne({ restaurant: restaurant._id });
    return res.send(restaurant);
  } catch (e) {
    return res.status(400).send(e)
  }
};



router.get('', auth, getRestaurant);
router.post('', auth, createRestaurant);


export default router;