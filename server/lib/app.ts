import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import PassportConfig from './config/passport-config';
import * as mongoose from 'mongoose';
import * as keys from './config/keys';

class App {

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public app: express.Application;

  private config(): void {
      mongoose.connect(keys.mongoURI);
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      PassportConfig.startPassportProcess();
  }

  private routes(): void {
    const router = express.Router();
    //Google Authentication routes
    PassportConfig.getAuthRoutes(router);
    this.app.use('/', router);
  }

}

export default new App().app;
