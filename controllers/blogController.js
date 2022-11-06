const { checkUser } = require('../middleware/jwt');
const Blog = require('../models/blogModel');
const User = require('../models/userModel');

const getAllBlogs = async (req, res) => {
    const allBlogs = await Blog.find({});
    res.status(200).json(allBlogs)
}

const getMyBlogs = async (req, res) => {
    const blogs = await Blog.find({})
    res.send(blogs)
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

    await Blog.findOneAndDelete({ title: "How to kill titans" })
    .then(() => console.log('User removed'))
    .catch((err) => console.log(err))

    const blog = new Blog(req.body);
    const userId = await checkUser(req, res)
    const author = await User.findById(userId)
    author.blogs.push(blog.title)
    blog.author = author.first_name;
    await author.save()
    await blog.save();

    return res.json(blog);
}

const deleteBlog = async (req, res) => {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)
    res.json({ deletedBlog: deletedBlog.title })
}

const updateBlog = async (req, res) => {

    res.send("Update")

    // if(req.params.state == "draft"){
    //     const publishedBlog = await Blog.findByIdAndUpdate(req.params.id, { state: "draft" });
    //     res.send(`Saved ${publishedBlog.title} to drafts`)
    // }

    // if(req.params.state == "published"){
    //     const publishedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { state: "published" });
    //     res.send(`Published ${publishedBlog.title}`)
    // }

    // const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body);
    // res.json({ updatedBlog: updatedBlog.title });
}

module.exports = {
    getAllBlogs,
    getMyBlogs,
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog
}