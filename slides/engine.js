const markdownItInclude = require('markdown-it-include')
const markdownItContainer = require('markdown-it-container')

module.exports = ({ marp }) => marp.use(markdownItInclude, "./slides").use(markdownItContainer, "mermaid");