require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

const homeController = require('./controllers/home');
const newPostController = require('./controllers/newPost');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const editPostController = require('./controllers/editPost');
const updatePostController = require('./controllers/updatePost');
const deletePostController = require('./controllers/deletePost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');

const validationMiddleware = require('./middleware/validationMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

const app = express();

// Moteur de vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Connexion à la base de données MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/newBlog';
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connecté à MongoDB'))
  .catch((error) => console.error('Erreur de connexion MongoDB :', error.message));

// Middlewares généraux
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'nodejs est top',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
  })
);
app.use(flash());

// Rend l'état de connexion accessible dans toutes les vues (navbar)
app.use((req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.userId);
  res.locals.currentUser = req.session.userId || null;
  next();
});

// Routes d'authentification
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);
app.get('/auth/logout', logoutController);

// Routes du blog
app.get('/', homeController);
app.get('/posts/new', authMiddleware, newPostController);
app.post('/posts/store', authMiddleware, validationMiddleware, storePostController);
app.get('/posts/:id/edit', authMiddleware, editPostController);
app.post('/posts/:id/edit', authMiddleware, updatePostController);
app.post('/posts/:id/delete', authMiddleware, deletePostController);
app.get('/post/:id', getPostController);

// Pages statiques
app.get('/about', (req, res) => res.render('about', { title: 'À propos' }));
app.get('/contact', (req, res) => res.render('contact', { title: 'Contact' }));

// Page 404 pour les routes inconnues
app.use((req, res) => {
  res.status(404).render('notfound', { title: 'Page introuvable' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Erreur' });
});

module.exports = app;
