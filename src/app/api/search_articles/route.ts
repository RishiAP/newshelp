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
            articles=await News.find({$or:[{title:{$regex:`${query}*`,$options:'i'}},{metadata:{$regex:`${query}*`,$options:'i'}},{"content.ops":{$elemMatch:{insert:{$regex:`${query}*`,$options:"i"}}}}]}).sort({date:-1}).limit(4);
        }
        else{
            articles=await News.find({$or:[{title:{$regex:`${query}*`,$options:'i'}},{metadata:{$regex:`${query}*`,$options:'i'}},{"content.ops":{$elemMatch:{insert:{$regex:`${query}*`,$options:"i"}}}}],date:{$lt:new Date(dateTime)}}).sort({date:-1}).limit(4);
        }
        return NextResponse.json(articles, { status: 200 });
    }
    catch(error){
        return NextResponse.json({error},{status:500});
    }
}