var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	_id: String,
	name: String,
	gender: String,
	age: Number,
	email: String,
	phone: String,
	qualification: String,
	lookingFor: String,
	bio: String
});

module.exports = mongoose.model('Post', postSchema);