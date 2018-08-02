const User = require('../models/user');

module.exports = {
    signUp: async (req, res, next) => {
        console.log('UsersController.signUp() has called !!');
        const { email, password } = req.value.body;
        const newUser = new User({ email, password });
        await newUser.save();

        res.json({ user: 'created' });
        res.end();
    },
    signIn: async (req, res, next) => {
        console.log('UsersController.signIn() has called !!');
    },
    secret: async (req, res, next) => {
        console.log('UsersController.secret() has called !!');
    },
}