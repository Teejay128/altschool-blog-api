const { checkUser } = require('../middleware/jwt');
const { readingTime } = require('../middleware/utils')
const Article = require('../models/articleModel');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns all the articles
 * 
 * Filters, sorts and paginates the articles
 * 
 * Returns only published articles
 */
const getAllArticles = async (req, res) => {
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.skip)

    const articles = await Article.find()
        .where({ state: "published"})
        .skip(offset)
        .limit(limit)

    if(!articles.length){
        return res.json({
            status: "failed",
            message: "There are no published articles, check Drafts!"
        })
    }
    const articleCount = articles.length

    const currentPage = Math.ceil(articleCount % offset)
    const totalPages = Math.ceil(articleCount / limit)

    res.status(200).json({
        status: "success",
        message: "All published articles",
        total: articleCount,
        page: currentPage,
        pages: totalPages,
        data: articles
    })

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns all the articles by a particular user
 * 
 * Checks the current logged in user
 * 
 * Paginates, sorts and filters the articles
 * 
 * Returns only published articles
 */
const getMyArticles = async (req, res) => {
    const limit = parseInt(req.query.limit)
    const offset = (req.query.limit)

    const user = await checkUser(req, res)

    const userArticles = Article.find({ author: user.firstName})
        .skip(offset)
        .limit(limit)

    if(!userArticles.length){
        return res.json({
            status: "failed",
            message: "This user does not have any published articles"
        })
    }

    const articleCount = userArticles.length

    const totalPages = Math.ceil(articleCount / limit)
    const currentPage = Math.ceil(articleCount % offset)

    res.status(200).json({
        status: "success",
        message: `All articles, published by ${user.firstName}`,
        total: articleCount,
        page: currentPage,
        pages: totalPages,
        data: userArticles
    })

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns published article with the article id
 * 
 * increases the read count
 * 
 * returns only a single article
 */
const getArticle = async (req, res) => {
    const article = await Article.findById(req.params.id)
        .where({ state: "published" })

    if(!article){
        return res.status(404).send("The Article you requested was not found")
    }

    article.read_count++

    article.save()

    res.status(200).json({
        status: "success",
        message: `Single article post: "${article.title}"`,
        data: {
            article
        }
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns created article
 * 
 * Gets article properties from the request.body object
 * 
 * Adds the article title to the list of user articles
 * 
 * Returns the created article
 */
const createArticle = async (req, res) => {
    
    try{
        const { title, description, state, tags, body } = req.body;

        const exists = await Article.findOne({ title })
        if(exists){
            return res.json({
                status: "failed",
                message: "Article with that title already exists"
            })
        }


        const user = await checkUser(req, res)

        if(!user){
            return res.json({
                status: "failed",
                message: "You need to be logged in to create a articlepost"
            })
        }

        const article = new Article({
            title,
            description,
            author: user.firstName,
            state,
            reading_time: readingTime(body),
            tags: tags,
            body,
        })

        user.articles.push(article.title)
        await user.save()
        await article.save()
    
        return res.json({
            status: "success",
            message: `${user.firstName} ${user.lastName} created "${article.title}"`,
            data: article
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
 * @returns the deleted article
 * 
 * Deletes article from the database
 * 
 * Remove article title form the list of user articles
 * 
 * returns deleted article
 */
const deleteArticle = async (req, res) => {

    const article = await Article.findOne({ __id: req.params.id })
    const user = await checkUser(req, res)
    
    if(user.firstName !== article.author){
        return res.status(401).send({
            message: "You are not authorized to delete this article"
        })
    }

    const userArticles = user.articles
    for(let i = 0; i < userArticles.length; i++){
        if(userArticles[i] == article.title){
            userArticles.splice(i, 1)
        }
    }

    await user.save()
    
    await Article.findByIdAndDelete(req.params.id)
    res.json({
        status: "success",
        message: `${article.title} was deleted`,
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns the deleted article
 * 
 * Updates article in the database
 * 
 * returns updated article
 */
const updateArticle = async (req, res) => {
    const { title, description, state, tags, body } = req.body;

    const user = await checkUser(req, res)
    const article = await Article.findById(req.params.id)

    if(user.firstName !== article.author){
        return res.send("You are not authorised to update this article")
    }

    const updatedArticle = await Article.findByIdAndUpdate({ _id: req.params.id }, {
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
        message: `${updatedArticle.title} was updated`,
        data: {
            updatedArticle
        }
    })
}

module.exports = {
    getAllArticles,
    getMyArticles,
    getArticle,
    createArticle,
    deleteArticle,
    updateArticle,
}