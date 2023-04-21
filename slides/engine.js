const markdownItInclude = require('markdown-it-include')

module.exports = ({ marp }) => marp.use(markdownItInclude, "./slides");