var chai = require('chai').assert;
var request = require('request');

describe('Login page should respond to GET', function(){

	var url = "http://localhost:8080/login";
	
	it('return status 200', function() {
		request(url, function(err, res, body){
			expect(res.statusCode).to.equal(200);
		});
	});

});