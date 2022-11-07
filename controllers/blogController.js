const { sortBy } = require('lodash');
const { checkUser } = require('../middleware/jwt');
const { readingTime } = require('../middleware/utils')
const Blog = require('../models/blogModel');
const User = require('../models/userModel');

const getAllBlogs = async (req, res) => {
    const queries = { ...req.query }

    const otherFields = ["page", "sort", "limit", "fields"]
    otherFields.forEach((field) => delete queries[field]);
    let query = blogModel.find(queryObj)

    if(req.query.sort){
        const sort = req.query.sort.split(",").join(" ")
        query = query.sort(sort)
    } else {
        query = query.sort("-createdAt")
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.linit * 1 || 20;
    const skip = (page - 1) * limit;

    if(req.query.page){
        const articles = await Blog.countDocuments().where({ state: "published" });
        if(skip >= articles){
            return res.status(404).send("This page does not exist");
        }
    }

    query = query.skip(skip).limit(limit);

    const published = await Blog.find(query).where({ state: "published" }).populate("user", { first_name: 1, last_name: 1, _id: 1 })

    res.status(200).json({
        result: published.length,
        current_page: page,
        limit,
        totalPages: Math.ceil(published.length / limit),
        data: {
            published
        }
    })
}

const getMyBlogs = async (req, res) => {
    const userId = await checkUser(req, res);
    const user = await User.findById(userId)

    const queries = { ...req.query };

    const otherFields = ["page", "sort", "limit"];
    otherFields.forEach((field) => delete queries[field])

    let query = Blog.find({ author: user.first_name })

    if(req.query.sort){
        const sort = req.query.sort.split(",").join(" ");
        query = query.sort(sort);
    } else {
        query = query.sort("-createdAt");
    }

    const page = req.query.page * 1 || 1; 
    const limit = req.query.limit * 1 || 20; 
    const skip = (page - 1) * limit;

    if(req.query.page){
        const articles = await query.countDocuments()
        if(skip >= articles){
            return res.status(404).send("This page does not exist")
        }
    }

    query = query.skip(skip).limit(limit);

    query = query.populate("user", { first_name: 1, last_name: 1, _id: 1 });

    const blogs = await query;

    return res.status(200).json({
        status: "success",
        result: blogs.length,
        data: {
            blogs: blogs
        }
    })

}

const getBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id).where({ state: "published" }).populate("user", { first_name: 1, last_name: 1, _id: 1 });

    if(!blog){
        return res.status(404).send("Article not found")
    }

    blog.read_count++

    blog.save()

    res.status(200).json({
        status: "success",
        blog
    })
}

const createBlog = async (req, res) => {
    
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
    const { title, description, read_count, state, tags, body } = req.body;

    const userId = await checkUser(req, res);
    const user = await User.findById(userId)

    const blog = Blog.findById(req.params.id)

    if(user.first_name !== blog.author){
        return res.send("You are not authorised to delete this blog")
    }

    const updatedBlog = await Blog.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            title,
            description,
            state,
            tags,
            body
        }
    }, { new: true })

    res.status(200).json({
        status: "success",
        data: {
            updatedBlog
        }
    })
}

module.exports = {
    getAllBlogs,
    getMyBlogs,
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog
}