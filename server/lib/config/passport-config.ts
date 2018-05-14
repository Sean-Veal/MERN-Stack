    import * as passport from 'passport';
    import * as passportGoogle from 'passport-google-oauth20';
    import * as passportFacebook from 'passport-facebook';
    import getKeys from './keys';
    import {User} from '../models/user';
    import {IUser} from '../interfaces/User';
    import {Request, Response} from 'express';

    class PassportConfig {
        constructor() {}

        private GoogleStrategy = passportGoogle.Strategy;
        private FacebookStrategy = passportFacebook.Strategy;
        private keys = getKeys();

        startPassportProcess() {
            const googleConfig: Object = {
                clientID: this.keys.googleClientID,
                clientSecret: this.keys.googleClientSecret,
                callbackURL: '/auth/google/callback'
            };
            const facebookConfig: Object = {
                clientID: this.keys.facebookAppId,
                clientSecret: this.keys.facebookAppSecret,
                callbackURL: '/auth/facebook/callback',
                profileFields: ["name", "email", "link", "locale", "timezone"]
            };
            // This user is what's being pulled from the DB 
            // That we just put in below
            //Incoming Request with cookie
            passport.serializeUser((user, done) => {
                // user.id is the id from the mongo entry
                done(null, user.id);
            });

            // Search DB for the id and turn it into a
            // Mongose instance
            passport.deserializeUser((id, done) => {
                User.findById(id)
                    .then((user) => {
                        done(null, user);
                    })
            });

            //Google OAuth Flow
            passport.use(new this.GoogleStrategy(googleConfig, 
                (accessToken, refreshToken, profile, done) => {
                    User.findOne({ googleId: profile.id })
                    .then((existingUser) => {
                        if(existingUser) {
                            done(null, existingUser);
                        } else {
                            let user = new User({googleId: profile.id});
                            user.save()
                            .then((user) => done(null, user));
                        }
                    })
                }));

                //Facebook OAuth Flow
                passport.use(new this.FacebookStrategy(facebookConfig,
                (accessToken, refreshToken, profile, done) => {
                    User.findOne({ facebookId: profile.id })
                    .then((existingUser) => {
                        if(existingUser) {
                            done(null, existingUser);
                        } else {
                            let user = new User({facebookId: profile.id});
                            user.save()
                            .then((user) => done(null, user));
                        }
                    })
                }));
        }

            public getAuthRoutes(router) {
                router.get('/auth/google', passport.authenticate('google', {
                    scope: ['profile', 'email']
                }));

                router.get('/auth/facebook', passport.authenticate('facebook', {
                    
                }));
                        
                router.get('/auth/google/callback', passport.authenticate('google'));
                router.get('/auth/facebook/callback', passport.authenticate('facebook'));

                router.get('/api/current_user', (req: Request, res: Response) => {
                    res.status(200).send(req.user);
                });

                router.get('/api/logout', (req: Request, res: Response) => {
                    req.logout();
                    res.status(200).send(req.user);
                })
            }
    }

    export default new PassportConfig();