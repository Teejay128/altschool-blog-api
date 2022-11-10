const { checkUser } = require('../middleware/jwt');
const { readingTime } = require('../middleware/utils')
const Blog = require('../models/blogModel');
const User = require('../models/userModel');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns all the blogs
 * 
 * Filters, sorts and paginates the blogs
 * 
 * Returns only published blogs
 */
const getAllBlogs = async (req, res) => {
    const queries = { ...req.query }

    const otherFields = ["page", "sort", "limit", "fields"]
    otherFields.forEach((field) => delete queries[field]);
    let query = Blog.find(queries)

    if(req.query.sort){
        const sort = req.query.sort.split(",").join(" ")
        query = query.sort(sort)
    } else {
        query = query.sort("-createdAt")
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    if(req.query.page){
        const articles = await Blog.countDocuments().where({ state: "published" });
        if(skip >= articles){
            return res.status(404).send("This page does not exist");
        }
    }

    query = query.skip(skip).limit(limit);

    const published = await Blog.find(query).where({ state: "pubished" }).populate("user", { first_name: 1, last_name: 1, _id: 1 })

    if(published.length == 0){
        return res.send("There are no published blogs, check Drafts!")
    }

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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns all the blogs by a particular user
 * 
 * Checks the current logged in user
 * 
 * Paginates, sorts and filters the blogs
 * 
 * Returns only published blogs
 */
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
    
    if(blogs.length == 0){
        return res.status(500).send("This user has not written any published blogs")
    }

    return res.status(200).json({
        status: "success",
        message: `All the blogs written by ${user.first_name} ${user.last_name}`,
        result: blogs.length,
        data: {
            blogs: blogs
        }
    })

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns published blog with the blog id
 * 
 * increases the read count
 * 
 * returns only a single blog
 */
const getBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id).where({ state: "published" }).populate("user", { first_name: 1, last_name: 1, _id: 1 });

    if(!blog){
        return res.status(404).send("The Blog you requested was not found")
    }

    blog.read_count++

    blog.save()

    res.status(200).json({
        status: "success",
        message: blog.title,
        data: {
            blog
        }
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns created blog
 * 
 * Gets blog properties from the request.body object
 * 
 * Adds the blog title to the list of user blogs
 * 
 * Returns the created blog
 */
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
    
        return res.json({
            status: "success",
            message: `${user.first_name} ${user.last_name} created ${blog.title}`,
            data: {
                blog
            }
        });
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns the deleted blog
 * 
 * Deletes blog from the database
 * 
 * Remove blog title form the list of user blogs
 * 
 * returns deleted blog
 */
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
        }
    }

    await user.save()
    
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)
    res.json({
        status: "success",
        message: `${deletedBlog.title} was deleted`,
        data:{
            deletedBlog
        }
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns the deleted blog
 * 
 * Updates blog in the database
 * 
 * returns updated blog
 */
const updateBlog = async (req, res) => {
    const { title, description, read_count, state, tags, body } = req.body;

    const userId = await checkUser(req, res);
    const user = await User.findById(userId)

    const blog = Blog.findById(req.params.id)

    if(user.first_name !== blog.author){
        return res.send("You are not authorised to update this blog")
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
        message: `${updatedBlog.title} was updated`,
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