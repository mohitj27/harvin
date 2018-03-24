var config = {
  local: {
    mode: 'local',
    port: 3000,
    mongo: {
      host: '127.0.0.1',
      port: 27017,
      dbName: 'harvin'
    }
  },
  test: {
    mode: 'test',
    port: 4000,
    mongo: {
      host: '127.0.0.1',
      port: 27017,
      dbName: 'harvin-test'
    }
  },
  production: {
    mode: 'production',
    port: 3000,
    mongo: {
      host: '127.0.0.1',
      port: 27017,
      dbName: 'harvin'
    }
  }
}
module.exports = function (mode) {
  return config[mode || process.argv[2] || 'local'] || config.local
}
