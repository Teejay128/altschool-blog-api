const { checkUser } = require('../middleware/jwt');
const { readingTime } = require('../middleware/utils')
const Blog = require('../models/blogModel');
const User = require('../models/userModel');

const getAllBlogs = async (req, res) => {
    const allBlogs = await Blog.find({});
    res.status(200).json(allBlogs)
}

const getMyBlogs = async (req, res) => {
    const userId = await checkUser(req, res);
    const user = await User.findById(userId)
    const userBlogs = await Blog.find({ author: user.first_name })
    res.status(200).json(userBlogs);
}

const getBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    blog.read_count++

    res.status(200).json({
        title: blog.title,
        description: blog.description,
        body: blog.body,
        writtenBy: blog.author,
        timesRead: blog.read_count
    })
}

const createBlog = async (req, res) => {
    
    await Blog.findOneAndDelete({ title: "How to kill titans" })

    try{
        const { title, description, read_count, state, tags, body } = req.body;

        const userId = await checkUser(req, res)
        const user = await User.findById(userId)

        const blog = new Blog({
            title,
            description,
            author: user.first_name,
            state,
            read_count,
            reading_time: readingTime(body),
            tags: tags,
            body
        })

        user.blogs.push(blog.title)
        await user.save()
        await blog.save()
    
        return res.json(blog);
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

const deleteBlog = async (req, res) => {
    const userId = await checkUser(req, res);
    const user = await User.findById(userId);
    const blog = await Blog.findById(req.params.id)

    if(user.first_name !== blog.author){
        return res.send("You are not authorised to delete this blog")
    }

    const userBlogs = user.blogs
    for(let i = 0; i < userBlogs.length; i++){
        if(userBlogs[i] == blog.title){
            userBlogs.splice(i, 1)
            console.log("dealt with")
        }
    }

    await user.save()
    
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)
    res.json(deletedBlog)
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