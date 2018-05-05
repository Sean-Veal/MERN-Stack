    import * as passport from 'passport';
    import * as GoogleStrategy from 'passport-google-oauth20';
    import * as keys from './keys';
    import {User} from '../models/user';
    import {IUser} from '../interfaces/User';

    class PassportConfig {
        constructor() {}

        startPassportProcess() {
            const strategyConfig: Object = {
                clientID: keys.googleClientID,
                clientSecret: keys.googleClientSecret,
                callbackURL: '/auth/google/callback'
            };
            passport.use(new GoogleStrategy.Strategy(strategyConfig, 
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
        }

            public getAuthRoutes(router) {
                router.get('/auth/google', passport.authenticate('google', {
                    scope: ['profile', 'email']
                }));
                        
                router.get('/auth/google/callback', passport.authenticate('google'));
            }
    }

    export default new PassportConfig();