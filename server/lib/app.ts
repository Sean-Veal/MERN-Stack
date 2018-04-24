import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import * as passport from 'passport';
import * as GoogleStrategy from 'passport-google-oauth20';
class App {

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public app: express.Application;

  private config(): void {
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      passport.use(new GoogleStrategy.Strategy());

  }

  private routes(): void {
    const router = express.Router();

    this.app.use('/', router);
  }

}

export default new App().app;
