const User = require('../models/user');

module.exports = {
    signUp: async (req, res, next) => {
        console.log('UsersController.signUp() has called !!');
        const {
            email,
            password
        } = req.value.body;

        // Check if there is a user with the same email
        const foundUser = await User.findOne({
            email
        });
        if (foundUser) {
            return res.status(403).json({ error: 'Email is already in use' });
        }


        //  Create a new user
        const newUser = new User({
            email,
            password
        });
        await newUser.save();

        // Respond with token
        res.json({
            user: 'created'
        });
        res.end();
    },
    signIn: async (req, res, next) => {
        console.log('UsersController.signIn() has called !!');
    },
    secret: async (req, res, next) => {
        console.log('UsersController.secret() has called !!');
    },
}