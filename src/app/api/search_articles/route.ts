import { connect } from "@/database/dbConfig";
import { News } from "@/models/NewsModel";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function GET(req: NextRequest) {
    try{
        const query=req.nextUrl.searchParams.get("query");
        if(query==null) return NextResponse.json({error:"Query not found"},{status:404});
        const dateTime:string=req.nextUrl.searchParams.get("datetime") || "NONE";
        let articles;
        if(dateTime=="NONE"){
            articles=await News.find({$or:[{title:{$regex:`${query}*`,$options:'i'}},{metadata:{$regex:`${query}*`,$options:'i'}},{"content.ops":{$elemMatch:{insert:{$regex:`${query}*`,$options:"i"}}}}]},{content:0}).sort({createdOn:-1}).limit(4).populate("category");
        }
        else{
            articles=await News.find({$or:[{title:{$regex:`${query}*`,$options:'i'}},{metadata:{$regex:`${query}*`,$options:'i'}},{"content.ops":{$elemMatch:{insert:{$regex:`${query}*`,$options:"i"}}}}],createdOn:{$lt:new Date(dateTime)}},{content:0}).sort({createdOn:-1}).limit(4).populate("category");
        }
        return NextResponse.json(articles, { status: 200 });
    }
    catch(error){
        return NextResponse.json({error},{status:500});
    }
}