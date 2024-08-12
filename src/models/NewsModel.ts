import mongoose, { Schema } from "mongoose";
import Author from "./AuthorModel";

const CategorySchema=new Schema({
    value:{
        type:String,
        unique:true,
        required:true
    }
})

const NewsSchema=new Schema(
    {
        slug:{
            type:String,
            required:true,
            unique:true
        },
        title:{
            type: String,
            required:true,
        },
        topimage:{
            type:String,
            required:true
        },
        content:{
            type : Object,
            required:true
        },
        metadesc:{
            type:String,
            required:true
        },
        category:{
            type:Schema.Types.ObjectId,
            ref:'Category',
            required:true
        },
        createdOn:{
            type:Date,
            default:Date.now
        },
        dateUpdated:{
            type:Date,
            default:null
        },
        priority:{
            type:String,
            enum:['TopMost','Headline',null],
            nullable:true,
            default:null
        },
        views:{
            type:Number,
            default:0
        },
        author:{
            type:Schema.Types.ObjectId,
            ref:'Author',
            required:true
        }
    }
)
NewsSchema.index({slug:'text'});
const News=mongoose.models.News || mongoose.model('News',NewsSchema);
const Category=mongoose.models.Category || mongoose.model('Category',CategorySchema);

export {News,Category,Author};