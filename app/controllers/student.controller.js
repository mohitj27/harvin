const promise=require('bluebird'),
        User=require('../models/User'),
        jsonwebtoken=require('jsonwebtoken'),
        bcrypt=require('bcrypt'),
        jwtConfig = require('../config/jwt')



let loginWithJWT=(student)=>{
  return new promise((resolve,reject)=>{

      let username = student.username
      let password = student.password
      if (!username || !password) {
        return reject({
          success: false,
          msg: 'Please enter username and password.'
        })
      } else {
        User.findOne({
          username: username
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
                  msg: 'Successfully logged you in as ' + username,
                  token: token,
                  user
                })
              } else {
                reject({
                  success: false,
                  msg: 'Authentication failed. Username or Password did not match.'
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
  loginWithJWT
} 
