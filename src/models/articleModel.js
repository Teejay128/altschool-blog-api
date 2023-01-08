const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
      type: String,
      required: [true, "Please provide the title"],
      unique: [true, "The title name already exists"],
    },
    description: {
      type: String,
    },
    author: {
      type: String,
      required: [true, "Please provide the author"],
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: String,
      required: [true, "Please provide the reading time"],
    },
    tags: {
      type: [String],
      required: [true, "Please provide the tags"],
    },
    body: {
      type: String,
      required: [true, "Please provide the body"],
    }
}, {timestamps: true});

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;