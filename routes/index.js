// var express = require('express');
// var router = express.router();

var User = require('../models/user');
var Post = require('../models/post');

module.exports = function(app, passport){
	app.get('/', function(req, res){
		Post.find({}, function(err, result){
			if (err)
				throw err;
				res.render('index.ejs');
			res.render('index.ejs', { post : result });
		});
	});

	app.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}
	));

	app.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}
	));

	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', { user: req.user });
	});

	app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

	app.get('/auth/facebook/callback', 
		passport.authenticate('facebook', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));

	app.get('/auth/google', passport.authenticate('google', { scope : ['profile' , 'email'] }));

	app.get('/auth/google/callback', passport.authenticate('google', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));


	app.get('/connect/local', function(req, res){
		res.render('connect-local.ejs', { message: req.flash('signupMessage')});
	});

	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/connect/local',
		failureFlash: true
	}));

	app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));

	app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

	app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));

	app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

	app.get('/unlink/local', function(req, res){
		var user = req.user;
		user.local.username = null;
		user.local.password = null;

		user.save(function(err){
			if(err)
				throw err;
			res.redirect('/profile');
		})
	});

	app.get('/unlink/facebook', function(req, res){
		var user = req.user;

		user.facebook.token = null;
		user.save(function(err){
			if (err)
				throw err;
			res.redirect('/profile');
		});
	});

	app.get('/unlink/google', function(req, res){
		var user = req.user;

		user.google.token = null;
		user.save(function(err){
			if (err)
				throw err;
			res.redirect('/profile');
		});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	app.get('/publish', isLoggedIn, function(req, res){
		res.render('publish.ejs', { user : req.user, message: '' });
	});

	app.post('/publish', isLoggedIn, function(req, res){
		console.log("USERID HERE " + req.user.id);

		var newPost = new Post();
		newPost._id = req.user.id;
		newPost.name = req.body.name;
		newPost.gender = req.body.gender;
		newPost.age = req.body.age;
		newPost.email = req.body.email;
		newPost.phone = req.body.phone;
		newPost.qualification = req.body.qualification;
		newPost.lookingFor = req.body.lookingFor;
		newPost.bio = req.body.bio;

		Post.findOneAndUpdate(req.user.id, newPost, { upsert: true}, function(err, doc){
			if (err){
				newPost.save(function(err){
					if (err)
						throw err;
				});
			}
		});

		Post.find(req.user.id, function(err, post){
			if(err){
				throw err;
			} else {
				res.render('publish.ejs', { user: req.user, message: 'Saved Successfully !' });
			}
		});

	});

}

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

//module.exports = app;