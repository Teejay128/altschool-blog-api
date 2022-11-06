const { checkUser } = require('../middleware/jwt');
const Blog = require('../models/blogModel');
const User = require('../models/userModel');

const getAllBlogs = async (req, res) => {
    const allBlogs = await Blog.find({});
    res.status(200).json(allBlogs)
}

const getMyBlogs = async (req, res) => {
    const userId = await checkUser(req, res);
    const user = await User.findById(userId)
    const userBlogs = await User.find({ author: user.first_name })
    res.status(200).json(userBlogs);
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
    const userId = await checkUser(req, res)
    const user = await User.findById(userId)
    user.blogs.push(blog.title)
    blog.author = user.first_name;
    await user.save()
    await blog.save();

    return res.json(blog);
}

const deleteBlog = async (req, res) => {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)

    res.json({ deletedBlog: deletedBlog })
}

const updateBlog = async (req, res) => {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.json({ updatedBlog: updatedBlog });
}

module.exports = {
    getAllBlogs,
    getMyBlogs,
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog
}