const express = require('express')
const blogController = require('../controllers/blogController');
const { requireAuth } = require('../middleware/jwt');

const blogRouter = express.Router();

blogRouter.get('/', blogController.getAllBlogs); // Not secured

blogRouter.get('/user', requireAuth, blogController.getMyBlogs); // Secured

blogRouter.get('/:id', blogController.getBlog); // Not secured

blogRouter.post('/', requireAuth, blogController.createBlog); // Secured

blogRouter.delete('/:id', requireAuth, blogController.deleteBlog); // Secured

blogRouter.patch('/:id', requireAuth, blogController.updateBlog); // Secured

module.exports = blogRouter;