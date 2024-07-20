import { connect } from "@/database/dbConfig";
import { Category, News } from "@/models/NewsModel";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function GET(req: NextRequest) {
  try {
    const datetime=req.nextUrl.searchParams.get("datetime");
    let searchedTopMostNews,headlines,topMostNews;
    if(datetime!=null){
      headlines=await News.find({priority:"Headline",createdOn:{$lt:new Date(datetime)}},{content:0,priority:0}).sort({createdOn:-1}).limit(5).populate("category");
      return NextResponse.json(headlines,{status:200});
    }
    else{
      searchedTopMostNews=await News.find({priority:"TopMost"},{content:0,priority:0}).sort({createdOn:-1}).limit(1);
      if(searchedTopMostNews.length==0){
          topMostNews=null;
      } //if no topmost news found
      else{
          topMostNews=searchedTopMostNews[0];
      }
      headlines=await News.find({priority:"Headline"},{content:0,priority:0}).sort({createdOn:-1}).limit(5).populate("category");
    }
    return NextResponse.json({topMostNews,headlines},{status:200});
  } catch (error) {
    return NextResponse.json({error},{status:500});
  }
}