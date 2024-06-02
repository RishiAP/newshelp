import { connect } from "@/database/dbConfig";
import { Category, News } from "@/models/NewsModel";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function GET(req: NextRequest) {
  const category=await Category.findOne({value:req.nextUrl.searchParams.get("category")});
  if(category==null) return NextResponse.json({error:"Category not found"},{status:404});
  const dateTime:string=req.nextUrl.searchParams.get("datetime") || "NONE";
  console.log(dateTime);
  let articles=[];
  if(dateTime=="NONE"){
    articles=await News.find({category:(category)._id}).sort({date:-1}).limit(7);
  }
  else{
    articles=await News.find({category:(category)._id,date:{$lt:new Date(dateTime)}}).sort({date:-1}).limit(7);
  }
  try{
      return NextResponse.json(articles, { status: 200 });
  }
  catch(error){
        return NextResponse.json({error},{status:500});
  }
}