//Model setup
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema setup
const authorSchema = new Schema({
  name: {type: String, required: true},
  email: String
})

//Exporting model functions
module.exports = {
  getModel: (connection) => {
    return connection.model('Author', authorSchema);
  }
}
