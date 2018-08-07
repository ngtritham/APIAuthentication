const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration');

signToken = user => {
    return JWT.sign({
        iss: 'ThamNguyen',
        sub: user.id,
        iat: new Date().getTime(),  // current time
        exp: new Date().setDate(new Date().getDate() + 1)   // current time + 1 day ahead
    }, JWT_SECRET);
}

module.exports = {
    signUp: async (req, res, next) => {
        console.log('UsersController.signUp() has called !!');
        const {
            email,
            password
        } = req.value.body;

        console.log("Email:${email} password:${password}");
        // Check if there is a user with the same email
        const foundUser = await User.findOne({ "local.email": email });
        if (foundUser) {
            return res.status(403).json({ error: 'Email is already in use' });
        }


        //  Create a new user
        const newUser = new User({
            method: 'local',
            local: {
                email: email,
                password: password
            }

        });
        console.log("New User: ", newUser);
        await newUser.save();

        // Generate the token
        const token = signToken(newUser);

        // Respond with token
        res.status(200).json({token: token});

    },
    signIn: async (req, res, next) => {
        console.log('req.user', req.user);
        const token = signToken(req.user);
        console.log('Successful login !!');
        // Respond success !
        res.status(200).json({token: token});
    },

    facebookOAuth: async (req, res, next) => {
        console.log('FB OAuth');
        console.log('req.user', req.value.user);

        // Generate token
        const token = signToken(req.value.user);
        res.status(200).json({ token: token });
    },

    secret: async (req, res, next) => {
        console.log('Enter secret !!');
        res.json({ secret: 'resource' });
    },
}