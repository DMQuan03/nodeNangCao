const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var Blog = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type : String,
        required : true
    },
    numberViews:{
        type:Number,
        default : 0
    },
    Like : {
        type : Number,
        default : 0
    },
    Dislike : {
        type : Number,
        default : 0
    },
    likes : [
        {
            type : mongoose.Types.ObjectId,
            ref : "User"
        }
    ],

    Dislikes : [
        {
            type : mongoose.Types.ObjectId,
            ref : "User"
        }
    ],
    image : {
        type : String,
        default : "https://tse1.mm.bing.net/th?id=OIP.3vB4oZjAdzqHpIEFTPa8GwHaFn&pid=Api&P=0"
    },
    author : {
        type : String,
        default : "Admin"
    }
},{
    timestamps : true,
    // chi chay khi la JSON tra ve key chua dinh nghia
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

//Export the model
module.exports = mongoose.model('Blog', Blog);