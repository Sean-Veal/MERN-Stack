import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import PassportConfig from './config/passport-config';
import * as cookieSession from 'cookie-session';
import * as passport from 'passport';
import * as mongoose from 'mongoose';
import * as keys from './config/dev';

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
    //Google Authentication routes
    this.passportConfig.getAuthRoutes(router);
    this.app.use('/', router);
  }

}

export default new App().app;
