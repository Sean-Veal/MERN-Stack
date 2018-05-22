        import * as passport from 'passport';
        import * as passportGoogle from 'passport-google-oauth20';
        import * as passportFacebook from 'passport-facebook';
        import {User} from '../models/user';
        import {Request, Response} from 'express';

        class PassportConfig {
            constructor(public keys: any) {}

            private GoogleStrategy = passportGoogle.Strategy;
            private FacebookStrategy = passportFacebook.Strategy;

            private googleConfig: Object = {
                clientID: this.keys.googleClientID,
                clientSecret: this.keys.googleClientSecret,
                callbackURL: '/auth/google/callback',
                proxy: true
            };
            private facebookConfig: Object = {
                clientID: this.keys.facebookAppId,
                clientSecret: this.keys.facebookAppSecret,
                callbackURL: '/auth/facebook/callback',
                profileFields: ["name", "email", "link", "locale", "timezone"],
                proxy: true
            };

            startPassportProcess() {
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
                passport.use(new this.GoogleStrategy(this.googleConfig, 
    async (accessToken, refreshToken, profile, done) => {
                        const existingUser = await User.findOne({ googleId: profile.id })
                            if(existingUser) {
                                return done(null, existingUser);
                            }
                                const user = await new User({googleId: profile.id});
                                user.save();
                                done(null, user);
                    }));

                    //Facebook OAuth Flow
                    if(this.keys.facebookAppId) {
                    passport.use(new this.FacebookStrategy(this.facebookConfig,
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
        }

                public getAuthRoutes(router) {
                    router.get('/auth/google', passport.authenticate('google', {
                        scope: ['profile', 'email']
                    }));

                    router.get('/auth/facebook', passport.authenticate('facebook', {
                        
                    }));
                            
                    router.get(
                        '/auth/google/callback', 
                        passport.authenticate('google'),
                        (req: Request, res: Response) => {
                            res.redirect('/surveys');
                        }
                    );
                    router.get('/auth/facebook/callback', passport.authenticate('facebook'));

                    router.get('/api/current_user', (req: Request, res: Response) => {
                        res.status(200).send(req.user);
                    });

                    router.get('/api/logout', (req: Request, res: Response) => {
                        req.logout();
                        res.redirect('/');
                    })
                }
        }

        export default PassportConfig;