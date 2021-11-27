import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import './db/mongoose';
import express from 'express';

import authRouter from './routers/auth.router';
import restaurantRouter from './routers/restaurant.router';

const app = express();

app.use(
  express.json(),
  cors({
    origin: process.env.CLIENT_URL || '',
  }),
);


app.use("/api/auth", authRouter);
app.use("/api/restaurant", restaurantRouter);

app.use('*', (req, res) => {
  res.status(400).send('404 Not Found')
});


app.listen(process.env.PORT || 4000);