            import * as passport from 'passport';
            import * as GoogleStrategy from 'passport-google-oauth20';
            import * as keys from './keys';

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
                console.log("accessToken", accessToken);
                console.log("refreshToken", refreshToken);
                console.log("profile", profile);
                console.log("done", done);
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