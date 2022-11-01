const express = require('express')
const blogController = require('../controllers/blogController');

const blogRouter = express.Router();

blogRouter.get('/', blogController.getAllBlogs); // Not secured

blogRouter.post('/user', blogController.createBlog); // Secured

blogRouter.get('/:id', blogController.getBlog); // Not secured

blogRouter.delete('/:id', blogController.deleteBlog); // Not secured

blogRouter.put('/:id', blogController.updateBlog); // Not secured

module.exports = blogRouter;