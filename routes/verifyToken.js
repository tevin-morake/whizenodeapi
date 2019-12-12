const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('auth-token');
    if(!token) res.status(401).send('Access Denied : Invalid Token');

    try {
        verifiedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = verifiedToken;
        next();// goes on to the next middleware
    } catch(err) {
        res.status(400).send('Invalid Token :' + err.message);
    }
};