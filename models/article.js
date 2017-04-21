const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: String,
  category: String,
  introduction: String,
  contents: String,
  conclusion: String,
  published: Boolean
})

module.exports = {
  getModel: (connection) => {
    return connection.model('Article', articleSchema);
  }
}
