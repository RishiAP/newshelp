import mongoose, { Schema } from "mongoose";

const AuthorSchema=new Schema({
    name:{
        type:String,
        default:null
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        default:null
    },
    profilePic:{
        type:String,
        default:null
    },
    bio:{
        type:String,
        default:null
    },
    socialLinks:{
        type:Object,
        default:null
    },
    createdOn:{
        type:Date,
        default:null
    },
    verified:{
        type:Boolean,
        default:false
    },
    verifyToken:{
        type:String,
        default:null
    },
    verificationExpiryTime:{
        type:Date,
        default:null
    },
    forgetPassToken:{
        type:String,
        default:null
    },
    forgetPassTokenExpiryTime:{
        type:Date,
        default:null
    }
})

const Author = mongoose.models.Author || mongoose.model('Author',AuthorSchema);

export default Author;