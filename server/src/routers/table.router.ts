import { Request, Response, Router } from "express";
import auth from "../middlewares/auth.middleware";
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest';
import Restaurant from "../models/restaurant.model";
import Table from '../models/table.model';

const router = Router();

const createTable = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { referenceNumber, seats, index } = req.body;
  const user = (req as AuthenticatedRequest).user;

  try {

    const restaurantTables = await Table.find({ restaurant: user.restaurant });
    if (restaurantTables.some(t => t.index == index))
      return res.status(400).send("Duplicate table index");


    if (restaurantTables.some(t => t.referenceNumber == referenceNumber))
      return res.status(400).send("Duplicate table referenceNumber");

    const table = new Table({ referenceNumber, seats, index, restaurant: user.restaurant });
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
  const { reference } = req.params;
  const { index, seats } = req.body;
  const restaurantId = (req as AuthenticatedRequest).user.restaurant;

  try {
    const restaurantTables = await Table.find({ restaurant: restaurantId });

    const table = restaurantTables.find(t => t.referenceNumber == +reference);
    if (!table)
      return res.status(404).send();


    if (restaurantTables.some(t => t.index == index && t._id != table._id))
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
  const { reference } = req.params;
  const restaurantId = (req as AuthenticatedRequest).user.restaurant;
  try {
    const removedTable = await Table.findOneAndRemove({ restaurant: restaurantId, referenceNumber: +reference });
    await Restaurant.updateOne(
      { _id: restaurantId },
      { $pull: { tables: removedTable?._id } }
    );
    return res.send(removedTable);
  } catch (e: any) {
    return res.status(400).send(e.message)
  }
};


router.post('', auth, createTable);
router.put('/:reference', auth, updateTable);
router.delete('/:reference', auth, deleteTable);

export default router;