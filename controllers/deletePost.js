const path = require('path');
const fs = require('fs');
const BlogPost = require('../models/BlogPost');

module.exports = async (req, res, next) => {
  try {
    const blogpost = await BlogPost.findById(req.params.id);

    if (!blogpost) {
      return res.status(404).render('notfound', { title: 'Page introuvable' });
    }

    // Seul l'auteur peut supprimer son article
    if (blogpost.userid.toString() !== String(req.session.userId)) {
      return res.redirect('/');
    }

    // Suppression du fichier image associé s'il existe
    if (blogpost.image) {
      const filePath = path.resolve(__dirname, '..', 'public', blogpost.image.replace(/^\//, ''));
      fs.unlink(filePath, () => {});
    }

    await blogpost.deleteOne();
    res.redirect('/');
  } catch (error) {
    next(error);
  }
};
