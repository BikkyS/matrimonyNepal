process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = ('../bin/www');
var User = require('../models/user');

var should = chai.should();

chai.use(chaiHttp);

describe('User')