const path = require('path');
const BlogPost = require('../models/BlogPost');

module.exports = async (req, res, next) => {
  try {
    const title = (req.body.title || '').trim();
    const body = (req.body.body || '').trim();
    let imagePath = '';

    // L'image est optionnelle
    if (req.files && req.files.image) {
      const image = req.files.image;
      await image.mv(path.resolve(__dirname, '..', 'public', 'images', image.name));
      imagePath = '/images/' + image.name;
    }

    await BlogPost.create({
      title,
      body,
      image: imagePath,
      userid: req.session.userId
    });

    res.redirect('/');
  } catch (error) {
    if (error.name === 'ValidationError') {
      req.flash('postErrors', Object.keys(error.errors).map((key) => error.errors[key].message));
      req.flash('postData', req.body);
      return res.redirect('/posts/new');
    }
    next(error);
  }
};
