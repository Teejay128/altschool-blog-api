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
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.skip)

    const blogs = await Blog.find()
        .where({ state: "published"})
        .skip(offset)
        .limit(limit)

    if(!blogs.length){
        return res.json({
            message: "There are no published blogs, check Drafts!"
        })
    }
    const blogCount = blogs.length

    const totalPages = Math.ceil(blogCount / limit)
    const currentPage = Math.ceil(blogCount % offset)

    res.status(200).json({
        total: blogCount,
        page: currentPage,
        pages: totalPages,
        data: blogs
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

    let query = Blog.find({ author: user.firstName })

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

    query = query.populate("user", { firstName: 1, lastName: 1, _id: 1 });

    const blogs = await query;
    
    if(blogs.length == 0){
        return res.status(500).send("This user has not written any published blogs")
    }

    return res.status(200).json({
        status: "success",
        message: `All the blogs written by ${user.firstName} ${user.lastName}`,
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
    const blog = await Blog.findById(req.params.id).where({ state: "published" }).populate("user", { firstName: 1, lastName: 1, _id: 1 });

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
            author: user.firstName,
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
            message: `${user.firstName} ${user.lastName} created ${blog.title}`,
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
    const blog = await Blog.findOne({ __id: req.params.id })

    if(user.firstName !== blog.author){
        return res.status(401).send({
            message: "You are not authorized to delete this blog"
        })
    }

    const userBlogs = user.blogs
    for(let i = 0; i < userBlogs.length; i++){
        if(userBlogs[i] == blog.title){
            userBlogs.splice(i, 1)
        }
    }

    await user.save()
    
    await Blog.findByIdAndDelete(req.params.id)
    res.json({
        status: "success",
        message: `${blog.title} was deleted`,
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
    const { title, description, state, tags, body } = req.body;

    const userId = await checkUser(req, res);
    const user = await User.findById(userId)

    const blog = Blog.findById(req.params.id)

    console.log()
    if(user.firstName !== blog.author){
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

const blogError = (req, res) => {
    console.log("404 page")
    return res.status(404).json({
        status: "failed",
        message: "The page you are looking for cannot be found"
    })
}

module.exports = {
    getAllBlogs,
    getMyBlogs,
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog,
    blogError
}