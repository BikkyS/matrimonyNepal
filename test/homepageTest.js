var chai = require('chai').assert;
var request = require('request');

describe('should respond to GET', function(done){
	superagent
		.get('http://localhost:'+port)
		.end(function(res){
			expect(res.status).to.equal(200);
			done();
		})
})