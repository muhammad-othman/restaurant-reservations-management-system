import { Request, Response, Router } from "express";
import auth from "../middlewares/auth.middleware";
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest';
import Restaurant from "../models/restaurant.model";
import { hasNoRestaurant, hasRestaurant } from "../middlewares/hasRestaurant.middleware";

const router = Router();

const getRestaurant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = (req as AuthenticatedRequest).user;

  const restaurant = await Restaurant.findById(user.restaurant);
  return res.send(restaurant);
};

const createRestaurant = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = (req as AuthenticatedRequest).user;

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



router.get('', auth, hasRestaurant, getRestaurant);
router.post('', auth, hasNoRestaurant, createRestaurant);


export default router;