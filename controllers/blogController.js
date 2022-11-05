const Blog = require('../models/blogModel');

const getAllBlogs = async (req, res) => {
    const allBlogs = await Blog.find({});
    res.status(200).json(allBlogs)
}

const getMyBlogs = (req, res) => {
    res.send('my blogs')
}

const getBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.status(200).json({
        title: blog.title,
        description: blog.description,
        body: blog.body,
        author: blog.author
    })
}

const createBlog = async (req, res) => {
    const blog = new Blog(req.body);
    await blog.save();
    return res.json(blog);
}

const deleteBlog = async (req, res) => {
    let deleted = await Blog.findByIdAndDelete(req.params.id)
    res.send(deleted)
}

const updateBlog = (req, res) => {
    res.send('update')
}

module.exports = {
    getAllBlogs,
    getMyBlogs,
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog
}