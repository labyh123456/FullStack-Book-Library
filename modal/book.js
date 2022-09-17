const mongoose = require('mongoose');
const path = require('path');
const coverImageBasePath = 'uploads/bookCovers';
// create schrema
const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    publishDate:{
        type:Date,
        required:true
    },
    pageCount:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Number,
        required:true,
        default:Date.now
    },
    coverImage:{
        type:Buffer,
        required:true
    },
    coverImageType:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Author'
    }

})
bookSchema.virtual('coverImagePath').get(function(){
if(this.coverImage != null  && this.coverImageType != null){
    return `data:${this.coverImageType};charset=utf-8;base64, ${this.coverImage.toString('base64')}`
}
else 
console.log('cannot find name of image');   
})
module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;