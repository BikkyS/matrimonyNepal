var chai = require('chai').assert;
var request = require('request');

describe('Signup Page should respond to GET', function(done){

	var url = "http://localhost:8080/signup";
	
	it('return status 200', function() {
		request(url, function(err, res, body){
			expect(res.statusCode).to.equal(200);
		});
	});

});