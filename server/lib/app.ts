import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import * as passport from 'passport';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as keys from './config/keys';
class App {

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public app: express.Application;

  private config(): void {
    const strategyConfig: Object = {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    };
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      passport.use(new GoogleStrategy.Strategy(strategyConfig, 
        (accessToken) => {
          console.log("accessToken", accessToken);
        }));

  }

  private routes(): void {
    const router = express.Router();

    router.get('/auth/google', passport.authenticate('google', {
      scope: ['profile', 'email']
    }));

    router.get('/auth/google/callback', passport.authenticate('google'));

    this.app.use('/', router);
  }

}

export default new App().app;
