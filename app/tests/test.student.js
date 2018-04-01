process.env.LOAD_CONFIG = 'test';
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var User = require('../models/User');
var Batch = require('../models/Batch');

describe('Student', function () {
    it('should be able to register', function (next) {

        _user = {
            username: 'username',
            password: 'password',
            fullName: 'Full Name',
            emailId: 'test@test.com',
            phone: '9898989898',
          };
        next();
      });
  });
