const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');// helps us with hashing/salts
const {registerValidation, loginValidation} = require('./validation');

router.post('/register', async (req, res) => {
    // Validate the schema before creating a user in MongoDB
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Let us check if the user already exists in the database.
    // We don't want to create a user that already exists folks
    const userExists = await User.findOne({email: req.body.email});
    if(userExists) return res.status(400).send('User already exists!');

    // We do not store the password as clear text. Going to create a salt, and hash the password before storing it in MongoDB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    
    const user = new User({
        name:  req.body.name,
        email: req.body.email,
        password: hashedPassword 
    });

    try {
        const savedUser = await user.save();
        res.send({user: user._id});

    } catch(err) {
        res.status(400).send(err);
    }
});


router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Let us check if the user already exists in the database.
    // We don't want to login with  a user that already doesn't exist folks
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email or password incorrect');

    // check if the password is valid
    const validPass = bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(401).send('Unauthorized : Invalid password');

    // Create JWT Token & Assign it to the header so that the front-end app can use it to make multiple requests
    token = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN);
    res.header('auth-token',token).send(token);
    //TOO : Expire token after 30 minutes of inactivity
});


module.exports = router;