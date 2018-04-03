describe('Configuration setup', function () {
  it('should load local configurations', function (next) {
    process.env.LOAD_CONFIG = 'local';
    var config = require('../config')(process.env.LOAD_CONFIG);
    expect(config.mode).to.not.to.be.an('undefined');
    expect(config.mode).to.equal('local');
    expect(config.port).to.equal(3000);
    expect(config.mongo.dbName).to.equal('harvin');
    next();
  });

  it('should load test configurations', function (next) {
    process.env.LOAD_CONFIG = 'test';
    var config = require('../config')(process.env.LOAD_CONFIG);
    expect(config.mode).to.not.to.be.an('undefined');
    expect(config.mode).to.equal('test');
    expect(config.port).to.equal(4000);
    expect(config.mongo.dbName).to.equal('harvin-test');
    next();
  });

  it('should load production configurations', function (next) {
    process.env.LOAD_CONFIG = 'production';
    var config = require('../config')(process.env.LOAD_CONFIG);
    expect(config.mode).to.not.to.be.an('undefined');
    expect(config.mode).to.equal('production');
    expect(config.port).to.equal(3000);
    expect(config.mongo.dbName).to.equal('harvin');
    next();
  });
});
