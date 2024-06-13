import { connect } from "@/database/dbConfig";
import { Category, News } from "@/models/NewsModel";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function GET(req: NextRequest) {
  const category=await Category.findOne({value:req.nextUrl.searchParams.get("category")});
  const type=req.nextUrl.searchParams.get("type");
  if(category==null && type==null) return NextResponse.json({error:"Category not found"},{status:404});
  else if(type=="recent"){
    const slug_present=req.nextUrl.searchParams.get("slug_present");
    const articles=await News.find({slug:{$ne:slug_present}},{slug:1,title:1,topimage:1,date:1}).sort({date:-1}).limit(3);
    return NextResponse.json(articles, { status: 200 });
  }
  const dateTime:string=req.nextUrl.searchParams.get("datetime") || "NONE";
  console.log(dateTime);
  let articles=[];
  if(dateTime=="NONE"){
    articles=await News.find({category:(category)._id},{content:0}).sort({date:-1}).limit(7);
  }
  else{
    articles=await News.find({category:(category)._id,date:{$lt:new Date(dateTime)}},{content:0}).sort({date:-1}).limit(7);
  }
  try{
      return NextResponse.json(articles, { status: 200 });
  }
  catch(error){
        return NextResponse.json({error},{status:500});
  }
}