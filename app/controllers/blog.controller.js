const promise = require('bluebird'),
  Blog = require('../models/Blog');

const getOneBlog = () => {};

const updateBlogMode = (blogTitle, mode, check) => {
  check = check == 'true' ? 'on' : 'off';
  // console.log(check, mode, blogTitle)
  Blog.find({ blogTitle }, (err, foundBlog) => {
    // console.log(err)
    // console.log(foundBlog)
  });
  let state = {};
  state[mode] = check;
  return new Promise((resolve, reject) => {
    Blog.update(
      {
        blogTitle,
      },
      {
        $set: state,
      },
      (err, changedBlog) => {
        // console.log(changedBlog)
        if (err) reject(err);
        resolve(200);
      }
    );
  });
};

module.exports = {
  updateBlogMode,
};
