import mongoose, { Schema } from "mongoose";

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
        date:{
            type:Date,
            default:Date.now
        },
        // priority:{
        //     enum:['TopMost','Top',null]
        // },
        views:{
            type:Number,
            default:0
        },
        // author:{
        //     type:String,
        //     ref:'Author',
        //     required:true
        // }
    }
)
const News=mongoose.models.News || mongoose.model('News',NewsSchema);
const Category=mongoose.models.Category || mongoose.model('Category',CategorySchema);

export {News,Category};