const BlogPost = require('../models/BlogPost');

module.exports = async (req, res, next) => {
  try {
    const blogposts = await BlogPost.find({})
      .sort({ datePosted: -1 })
      .populate('userid');

    res.render('index', { title: 'Accueil', blogposts });
  } catch (error) {
    next(error);
  }
};
