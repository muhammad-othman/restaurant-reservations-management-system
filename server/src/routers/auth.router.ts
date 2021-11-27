import { Request, Response, Router } from "express";
import User from "../models/user.model";
const router = Router();


const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    return res.status(201).send({ user, token });
  } catch (e) {
    return res.status(400).send(e)
  }
};

const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    return res.send({ user, token })
  } catch (e) {
    return res.status(400).send();
  }
};


router.post("/signup", signUp);
router.post("/login", login);


export default router;