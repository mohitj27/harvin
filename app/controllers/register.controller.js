const Register = require('./../models/Register')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

function registerUser(User) {
    console.log('Inside controller, req.body received is: ', User, '\n\n' );
    // UserReg = new Register(User)
    Register.findOne({ email: User.email }).then((user) => {
        if (user) {
            console.log("\nA user with this email already exists :(\n")
            return new Promise ((resolve, reject) => {
                reject("email address has registered already");
            });
        }
        else {
            console.log("\nProcessing...\n");
            const UserReg = new Register(User);

            return UserReg.save((err, user) => {
                if (err) return err;
                console.log("\nuser registered, user: ", user, '\n\n')
            });
        }
    });

}
module.exports = {
    registerUser
}
