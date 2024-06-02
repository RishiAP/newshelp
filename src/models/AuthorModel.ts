import mongoose, { Schema } from "mongoose";

const AuthorSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    role:{
        enum:['Editor','Journalist']
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const Author = mongoose.models.Author || mongoose.model('Author',AuthorSchema);

export default Author;