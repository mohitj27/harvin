const path=require('path')
const webpack=require('webpack')

module.exports={
  entry:'./client/react-app-test/app.js',
  output:{path:__dirname,filename:'./app/public/js/bundle.js'},
  module:{
    rules:[
      {
        test:/.jsx?$/,
        loader:'babel-loader',
        exclude:/node_modules/,
        query:{
          presets:['es2015','react','stage-3']
        }
      }
    ]
  },
  node:{
    net:'empty',
    dns:'empty'
  }
}
