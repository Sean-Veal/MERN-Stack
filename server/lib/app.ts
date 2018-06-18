import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import PassportConfig from './config/passport-config';
import * as cookieSession from 'cookie-session';
import * as passport from 'passport';
import * as mongoose from 'mongoose';
import * as stripe from 'stripe';
import * as keys from './config/dev';
import requireLogin from './middlewares/requireLogin';

class App {

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public app: express.Application;
  private passportConfig: PassportConfig = new PassportConfig(keys);

  private config(): void {
      mongoose.connect(keys.mongoURI);
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      this.app.use(cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
      }));
      this.app.use(passport.initialize());
      this.app.use(passport.session());
      this.passportConfig.startPassportProcess();
  }

  private routes(): void {
    const router = express.Router();
    const stripeObj = stripe(keys.stripeSecretKey);
    //Google Authentication routes
    this.passportConfig.getAuthRoutes(router);
    router.post('/api/stripe', requireLogin, async (req: Request, res: Response) => {
          try{
          const chargeObj = await stripeObj.charges.create({
            amount: 500,
            currency: 'usd',
            description: '$5 for 5 credits',
            source: req.body.id
          });
          req.user.credits += 5;
          const user = await req.user.save();
          res.status(200).send(user);
        } catch(error) {res.status(401).send(error)} 
    });
    this.app.use('/', router);
  }

}

export default new App().app;
