const getAllBlogs = (req, res) => {
    res.send('All blogs')
}

const getBlog = (req, res) => {
    res.send('blog')
}

const createBlog = (req, res) => {
    res.send('create')
}

const deleteBlog = (req, res) => {
    res.send('delete')
}

const updateBlog = (req, res) => {
    res.send('update')
}

module.exports = {
    getAllBlogs,
    getBlog,
    createBlog,
    deleteBlog,
    updateBlog
}