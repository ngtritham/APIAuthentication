const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('./configuration');
const User = require('./models/user');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET
}, async (payLoad, done) => {
    try {
        // Find the user specified in token
        const user = await User.findById(payLoad.sub);

        // If user doesn't exists ,handle it
        if(!user){
            return done(null, false);
        }
        // Otherwise, return user
        done(null, user);
    } catch(error){
        done(error, false);
    }
}));

// Facebook Strategy
passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('profile', profile);
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);

        const existingUser = await User.findOne({ "facebook.id": profile.id });
        if(existingUser) {
            console.log("User already exist in DB !!!!!");
            return done(null, existingUser);
        }

        const newUser = new User({
            method: 'facebook',
            facebook: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message)
    }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        // Find the user given the email
        const user = await User.findOne({ "local.email": email });

        console.log("Email", email);
        // If not, handle it
        if (!user) {
            return done(null, false);
        }
        // Check if the passport is correct
        const isMatch = await user.isValidPassword(password);
        // If not, handle it
        console.log("isMatch: ", isMatch);
        if(!isMatch) {
            return done(null, false);
        }
        // Otherwise, return the user
        done(null, user);
    } catch (error) {
        done(error, false)
    }

}));