const router = require('express').Router();
const protect = require('./verifyToken');
const User = require('../model/User');

//TODO: Clean Up This Code In Next Release

router.get('/get', protect, (req, res) => {
    console.log('Awesome');
   /*  res.json({
        posts: {
            Title: "NodeJS sparks joy in the heart of man",
            Description: "Tevin just wrote his firs node API",
            Date : '209-12-12T11:52:00:01'
        }
    }) */
//    let foundUser = User.findOne({_id: "5df202ec710fc6cc2b04f131"});
       foundUser = User.findById(req.user, (err, user) => {
        if(err) {
            res.status(400).send('Error getting user');
        } else{
            const returnUser = {
                Name: user.name,
                Email: user.email,
                CreateDate: user.date
            }
            res.json(returnUser);
        }
            
       });
});

module.exports = router;