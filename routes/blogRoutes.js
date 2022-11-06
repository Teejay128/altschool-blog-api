const express = require('express')
const blogController = require('../controllers/blogController');
const { requireAuth } = require('../middleware/jwt');

const blogRouter = express.Router();

blogRouter.get('/', blogController.getAllBlogs); // Not secured

blogRouter.get('/user', blogController.getMyBlogs); // Secured

blogRouter.get('/:id', blogController.getBlog); // Not secured

blogRouter.post('/user', blogController.createBlog); // Secured

blogRouter.delete('/:id', blogController.deleteBlog); // Secured

blogRouter.put('/:id', blogController.updateBlog); // Secured

module.exports = blogRouter;