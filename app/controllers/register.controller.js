const Register = require('./../models/Register')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

function registerUser(User) {
    console.log(User);
    UserReg = new Register(User)
    Register.findOne({ email: User.email }).then((user) => {
        if (user) {
            return 'email address has registered already';
        }
        else {
            UserReg.save().then((user) => {
                // return 'successfully registerd';
                return new Promise((resolve, reject) => {
                    resolve(user);
                })
            });
        }
    });

}
module.exports = {
    registerUser
}
