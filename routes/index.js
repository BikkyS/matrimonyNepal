var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res){
	res.render('login', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res){
	res.render('signup', { message: req.flash('signupMessage') });
});

module.exports = router;
