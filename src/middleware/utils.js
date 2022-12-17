/**
 * 
 * @param {*} body 
 * @returns Readin time of the inputed body
 */
const readingTime = (body) => {
    const wordCount = body.split(" ").length;
    const readTime = Math.ceil(wordCount / 180)
    return `${readTime}mins`;
}

module.exports = {
    readingTime
}