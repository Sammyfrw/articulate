//Model setup
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema setup
const articleSchema = new Schema({
  title:  {type: String, required: true, unique: true},
  category: String,
  introduction: String,
  contents: String,
  conclusion: String,
  published: {type: Boolean, default: false},
  _author:  {type: Schema.Types.ObjectId, ref: 'Author',
              required: false
            }
})

//Exporting model functions
module.exports = {
  getModel: (connection) => {
    return connection.model('Article', articleSchema);
  }
}
