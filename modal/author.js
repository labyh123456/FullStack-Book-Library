const mongoose = require('mongoose');

// create schrema
const authorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('Author', authorSchema);