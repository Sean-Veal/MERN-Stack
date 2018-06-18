import { Request, Response, Next } from "express";

export default (req: Request, res: Response, next: Next) => {
    if(!req.user) {
        return res.status(401).send({error: 'You must log in!'});
    }

    next();
};