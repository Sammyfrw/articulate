const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: {type: String, required: true},
  email: String
})

module.exports = {
  getModel: (connection) => {
    return connection.model('Author', authorSchema);
  }
}
