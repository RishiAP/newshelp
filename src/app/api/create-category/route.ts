import { connect } from "@/database/dbConfig";
import { Author, Category } from "@/models/NewsModel";
import { NextRequest, NextResponse } from "next/server";
import { getAuthorFromHeader } from '@/helpers/common_func';
connect();
export async function POST(req: NextRequest) {
    try{
        let tempAuthor=await getAuthorFromHeader(req);
        if(tempAuthor==null){
            return NextResponse.json({message:"Unauthorized"}, { status: 401 });
        }
        let author=await Author.findById(tempAuthor._id,{_id:1,isSuperAdmin:1,sessionToken:1});
        if(author==null || author.sessionToken!=tempAuthor.sessionToken){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if(!author.isSuperAdmin){
            return NextResponse.json({message:"Permission Denied!"}, { status: 403 });
        }
        const {value} = await req.json();
        const newCategory=new Category({value});
        const savedCategory=await newCategory.save();
        return NextResponse.json(savedCategory, { status: 200 });
    }
    catch(error){
          return NextResponse.json({error},{status:500});
    }
  }