// var express = require('express');
// var router = express.router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var User = require('../models/user');
var Post = require('../models/post');

module.exports = function(app, passport){
	app.get('/', function(req, res){
		Post.find({}, function(err, result){
			if (err)
				throw err;
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
		successRedirect: '/profile',
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

	// app.get('/unlink/local', function(req, res){
	// 	var user = req.user;
	// 	user.local.username = null;
	// 	user.local.password = null;

	// 	user.save(function(err){
	// 		if(err)
	// 			throw err;
	// 		res.redirect('/profile');
	// 	})
	// });

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

		Post.findOneAndUpdate(req.user.id, newPost, { upsert: true }, function(err, doc){
			if (err){
				newPost.save(function(error){
					if (error)
						throw "Saving error ++++++++++++++++" + error;
				});
			}
		});

		Post.find(req.user.id, function(err, post){
			if(err){
				throw "Post find error: ++++++++++++++++++" + err;
			} else {
				res.render('publish.ejs', { user: req.user, message: 'Saved Successfully !' });
			}
		});

	});

	app.post('/upload', isLoggedIn, function(req, res){
		// create an incoming form object
	  var form = new formidable.IncomingForm();

	  // specify that we want to allow the user to upload multiple files in a single request
	  form.multiples = true;

	  // store all uploads in the /uploads directory
	  form.uploadDir = path.join(__dirname, '../uploads');

	  // every time a file has been uploaded successfully,
	  // rename it to it's orignal name
	  form.on('file', function(field, file) {
	    fs.rename(file.path, path.join(form.uploadDir, req.user.id +'.png'));
	  });

	  // log any errors that occur
	  form.on('error', function(err) {
	    console.log('An error has occured: \n' + err);
	  });

	  // once all the files have been uploaded, send a response to the client
	  form.on('end', function() {
	    res.end('success');
	  });

	  // parse the incoming request containing the form data
	  form.parse(req);

	});

}

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

//module.exports = app;