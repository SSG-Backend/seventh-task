var express = require('express');
const User = require('../models/User');

var router = express.Router();

// GET Dashboard
router.get('/', function(req, res, next) {

  var auth = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':');

  var email = auth[0];
  var authName = null;
  
  User.find({}, (error, result) => {
    if (error) {
      console.error(error);
      return null;
    }
    if (result != null) {
      // res.json(result);
      result.forEach(function(user) {
        if (user.email == email) {
          authName = user.name;
        }
      });
      res.render('dashboard', {users: result, name: authName});
    } else {
      res.json({});
    }
  });

  
});


module.exports = router;

