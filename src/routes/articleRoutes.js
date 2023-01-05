const express = require('express')
const blogController = require('../controllers/blogController');
const { requireAuth } = require('../middleware/jwt');

const blogRouter = express.Router();

blogRouter.get('/', blogController.getAllArticles); // Not secured

blogRouter.get('/user', requireAuth, blogController.getMyArticles); // Secured

blogRouter.get('/:id', blogController.getArticle); // Not secured

blogRouter.post('/', requireAuth, blogController.createArticle); // Secured

blogRouter.delete('/:id', requireAuth, blogController.deleteArticle); // Secured

blogRouter.patch('/:id', requireAuth, blogController.updateArticle); // Secured

module.exports = blogRouter;