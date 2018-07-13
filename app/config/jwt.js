module.exports = {
  jwtSecret: 'This is a secret phrase, it will be used for hashing the passwordField',
  jwtSession: {
    session: false,
  },
  getToken: function fromHeaderOrQuerystring(req, res) {
    let length = req.headers.authorization.split(" ").length
    console.log("req.headers.authorization", req.headers.authorization)
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[length - 1];
    }

    return null;
  },
};
