import { connect } from "@/database/dbConfig";
import Author from "@/models/AuthorModel";
import { NextRequest, NextResponse } from "next/server";
import { getAuthorFromHeader } from '@/helpers/common_func';
connect();
export async function POST(req: NextRequest) {
    try {
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
        const {email}=await req.json();
        author=await (new Author({email})).save();
        return NextResponse.json({success:true,author},{status:200});
    } catch (error) {
        return NextResponse.json({error},{status:500});
    }
}