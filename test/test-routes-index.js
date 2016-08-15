process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

chai.config.includeStack = true;
var should = chai.should();

chai.use(chaiHttp);

var server = require('../app');
var User = require('../models/user');
var Post = require('../models/post');

describe('Routes before logging in', function(){

	Post.collection.drop();

	beforeEach(function(done){
		var newPost = new Post({
			_id: 12345,
			name: 'John',
			gender: 'Male',
			age: 26,
			email: 'john@john.com',
			phone: 9849098490,
			qualification: 'ME',
			lookingFor: 'Hot lady',
			bio: 'Hello from NYC'
		});
		newPost.save(function(err){
			done();
		});
	});

	afterEach(function(done){
		Post.collection.drop();
		done();
	});

	it('should list ALL posts on / GET', function(){
		chai.request(server)
			.get('/')
			.end(function(err, res){
				res.should.have.status(200);
				res.should.be.json;
				done();
			});
	});

});