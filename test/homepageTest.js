var chai = require('chai').assert;
var request = require('request');

describe('Homepage should respond to GET', function(done){

	var url = "http://localhost:8080";
	
	it('return status 200', function() {
		request(url, function(err, res, body){
			expect(res.statusCode).to.equal(200);
		});
	});

});