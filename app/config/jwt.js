module.exports = {
  jwtSecret: 'This is a secret phrase, it will be used for hashing the passwordField',
  jwtSession: {
    session: false
  },
  getToken:function fromHeaderOrQuerystring (req,res) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null
  }
}
