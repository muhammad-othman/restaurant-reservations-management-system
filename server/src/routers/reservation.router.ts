import { Request, Response, Router } from "express";
import auth from "../middlewares/auth.middleware";
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest';
import Table from '../models/table.model';
import Reservation from '../models/reservation.model';
import Restaurant from '../models/restaurant.model';

const router = Router();

const createReservation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tableId } = req.params;
  const { date, customerName, customerEmail, customerPhoneNumber } = req.body;
  if (!date || !customerName || !customerEmail || !customerPhoneNumber)
    return res.status(400).send();


  const parsedDate = new Date(date);

  if (parsedDate.getMilliseconds() > 0
    || parsedDate.getSeconds() > 0
    || parsedDate.getMinutes() > 0)
    return res.status(400).send('Reservation date can only be at the begining of an hour');

  const user = (req as AuthenticatedRequest).user;

  try {

    const table = await Table.findById(tableId).populate('reservations');
    if (!table || table.restaurant.toString() !== user.restaurant.toString())
      return res.status(404).send();

    const matchedReservation = table.reservations.find(r => +r.date === +parsedDate);
    if (matchedReservation)
      return res.status(400).send("The table is already reserved for this time");

    const reservation = new Reservation({ date: parsedDate, customerName, customerEmail, customerPhoneNumber, table: tableId });
    await reservation.save();
    table.reservations.push(reservation);
    await table.save();

    return res.send(reservation);
  } catch (e: any) {
    return res.status(400).send(e.message)
  }
};

const updateReservation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tableId, reservationId } = req.params;
  const { date, customerName, customerEmail, customerPhoneNumber } = req.body;
  if (!date || !customerName || !customerEmail || !customerPhoneNumber)
    return res.status(400).send();


  const parsedDate = new Date(date);

  if (parsedDate.getMilliseconds() > 0
    || parsedDate.getSeconds() > 0
    || parsedDate.getMinutes() > 0)
    return res.status(400).send('Reservation date can only be at the begining of an hour');

  const user = (req as AuthenticatedRequest).user;

  try {

    const table = await Table.findById(tableId).populate('reservations');
    if (!table || table.restaurant.toString() !== user.restaurant.toString())
      return res.status(404).send();

    const reservation = table.reservations.find(r => r._id.toString() === reservationId);
    if (!reservation)
      return res.status(404).send();

    const matchedReservation = table.reservations.find(r => +r.date === +parsedDate && r._id.toString() !== reservationId);
    if (matchedReservation)
      return res.status(400).send("The table is already reserved for this time");

    reservation.date = parsedDate;
    reservation.customerName = customerName;
    reservation.customerEmail = customerEmail;
    reservation.customerPhoneNumber = customerPhoneNumber;


    await Reservation.updateOne({ _id: reservation._id }, { date: parsedDate, customerName, customerEmail, customerPhoneNumber });

    return res.send(reservation);
  } catch (e: any) {
    return res.status(400).send(e.message)
  }
};

const deleteReservation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { tableId, reservationId } = req.params;
  const restaurantId = (req as AuthenticatedRequest).user.restaurant;
  try {
    const table = await Table.findById(tableId);
    if (!table || table.restaurant.toString() !== restaurantId.toString())
      return res.status(404).send();

    const reservation = await Reservation.findById(reservationId);
    if (!reservation || reservation.table.toString() !== table._id.toString())
      return res.status(404).send();

    await reservation.remove();
    await Table.updateOne(
      { _id: tableId },
      { $pull: { reservations: reservationId } }
    );

    return res.send(reservation);
  } catch (e: any) {
    return res.status(400).send(e.message)
  }
};

const getReservation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { table, startdate, enddate } = req.query;
  try {
    if (!table && !startdate && !enddate)
      return res.status(404).send();
    const restaurant = await Restaurant.findById((req as AuthenticatedRequest).user.restaurant);
    if (!restaurant)
      return res.status(404).send();

    if (table) {
      if (!restaurant.tables.find(t => t.toString() === table.toString()))
        return res.status(404).send();

      const reservations = await Reservation.find({ table });
      return res.send(reservations);
    }

    const reservations = await Reservation.find({
      date: {
        $gte: new Date(startdate as any),
        $lte: new Date(enddate as any)
      },
      table: { $in: restaurant.tables }
    });

    return res.send(reservations);
  } catch (e: any) {
    return res.status(400).send(e.message)
  }
};


router.post('/:tableId/reservations', auth, createReservation);
router.delete('/:tableId/reservations/:reservationId', auth, deleteReservation);
router.put('/:tableId/reservations/:reservationId', auth, updateReservation);
router.get('/reservations', auth, getReservation);

export default router;