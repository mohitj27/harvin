const promise=require('bluebird'),
        HarvinQuizStudent=require('../models/csvTest'),
        jsonwebtoken=require('jsonwebtoken'),
        bcrypt=require('bcrypt'),
        jwtConfig = require('../config/jwt')


let registerHarvinStudent = (User) => {
    console.log('Inside controller, req.body received is: ', User, '\n\n' );
    // UserReg = new Register(User)
    HarvinQuizStudent.findOne({ email: User.email }).then((user) => {
        if (user) {
            console.log("\nA harvinStudent with this email already exists :(\n")
            return new Promise ((resolve, reject) => {
                reject("email address has registered already");
            });
        }
        else {
            console.log("\nProcessing...\n");
            const UserReg = new HarvinQuizStudent(User);

            return UserReg.save((err, user) => {
                if (err) return err;
                console.log("\nharvin student registered, user: ", user, '\n\n')
            });
        }
    });
}



let loginWithJWT=(student)=>{
  return new promise((resolve,reject)=>{

      let email = student.email;
      let password = student.password;
      console.log("email is: ", email, "password is: ", password, '\n')
      if (!email || !password) {
        return reject({
          success: false,
          msg: 'Please enter email and password.'
        })
      } else {
        HarvinQuizStudent.findOne({
          email: email
        }, function (err, user) {
          if (err) next(err || 'Internal Server Error')

          if (!user) {
            reject({
              success: false,
              msg: 'Authentication failed. User not found.'
            })
          } else {
            // Check if password matches
            user.comparePassword(password, function (err, isMatch) {
              if (isMatch && !err) {
                // Create token if the password matched and no error was thrown
                const token = jsonwebtoken.sign(user.toObject(), jwtConfig.jwtSecret, {
                  expiresIn: '7d' // 7 day
                })

                resolve({
                  success: true,
                  msg: 'Successfully logged you in as ' + email,
                  token: token,
                  user
                })
              } else {
                reject({
                  success: false,
                  msg: 'Authentication failed. email or Password did not match.'
                })
              }
            })
          }
        })
      }

  }) }

let signupWithJWT=(student)=>{
  
}
module.exports={
  loginWithJWT,
  registerHarvinStudent
} 
