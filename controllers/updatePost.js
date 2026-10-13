const path = require('path');
const BlogPost = require('../models/BlogPost');

module.exports = async (req, res, next) => {
  try {
    const blogpost = await BlogPost.findById(req.params.id);

    if (!blogpost) {
      return res.status(404).render('notfound', { title: 'Page introuvable' });
    }

    // Seul l'auteur peut modifier son article
    if (blogpost.userid.toString() !== String(req.session.userId)) {
      return res.redirect('/');
    }

    const title = (req.body.title || '').trim();
    const body = (req.body.body || '').trim();

    if (!title || !body) {
      return res.redirect('/posts/' + blogpost._id + '/edit');
    }

    blogpost.title = title;
    blogpost.body = body;

    // Remplacement de l'image uniquement si un nouveau fichier est envoyé
    if (req.files && req.files.image) {
      const image = req.files.image;
      await image.mv(path.resolve(__dirname, '..', 'public', 'images', image.name));
      blogpost.image = '/images/' + image.name;
    }

    await blogpost.save();
    res.redirect('/post/' + blogpost._id);
  } catch (error) {
    next(error);
  }
};
