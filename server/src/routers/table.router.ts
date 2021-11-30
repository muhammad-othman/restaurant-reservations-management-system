import { Request, Response, Router } from "express";
import auth from "../middlewares/auth.middleware";
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest';
import Reservation from "../models/reservation.model";
import Restaurant from "../models/restaurant.model";
import Table from '../models/table.model';

const router = Router();

const createTable = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { seats, index } = req.body;
  const user = (req as AuthenticatedRequest).user;

  try {

    const restaurantTables = await Table.find({ restaurant: user.restaurant });
    if (restaurantTables.some(t => t.index === index))
      return res.status(400).send("Duplicate table index");


    const table = new Table({ seats, index, restaurant: user.restaurant });
    await table.save();
    await Restaurant.updateOne(
      { _id: user.restaurant },
      { $push: { tables: table } }
    );
    return res.send(table);
  } catch (e: any) {
    return res.status(400).send(e.message)
  }
};

const updateTable = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tableId } = req.params;
  const { index, seats } = req.body;
  const restaurantId = (req as AuthenticatedRequest).user.restaurant;

  try {
    const restaurantTables = await Table.find({ restaurant: restaurantId });

    const table = restaurantTables.find(t => t._id.toString() === tableId);
    if (!table)
      return res.status(404).send();


    if (restaurantTables.some(t => t.index === index && t._id !== table._id))
      return res.status(400).send("Duplicate table index");

    table.index = index;
    table.seats = seats;
    await Table.updateOne({ _id: table._id }, { index, seats });

    return res.send(table);
  } catch (e: any) {
    return res.status(400).send(e.message)
  }
};

const deleteTable = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tableId } = req.params;
  const restaurantId = (req as AuthenticatedRequest).user.restaurant;
  try {
    const table = await Table.findById(tableId);
    if (!table || table.restaurant.toString() !== restaurantId.toString())
      return res.status(404).send();

    await table.remove();
    await Reservation.deleteMany({ table: tableId });

    await Restaurant.updateOne(
      { _id: restaurantId },
      { $pull: { tables: tableId } }
    );
    return res.send(table);
  } catch (e: any) {
    return res.status(400).send(e.message)
  }
};


router.post('', auth, createTable);
router.put('/:tableId', auth, updateTable);
router.delete('/:tableId', auth, deleteTable);

export default router;