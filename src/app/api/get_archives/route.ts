import { connect } from "@/database/dbConfig";
import { News } from "@/models/NewsModel";
import { NextRequest, NextResponse } from "next/server";
enum Months{
    January=1,
    February=2,
    March=3,
    April=4,
    May=5,
    June=6,
    July=7,
    August=8,
    September=9,
    October=10,
    November=11,
    December=12
}
connect();
export async function GET(req: NextRequest) {
    const searchParams=req.nextUrl.searchParams;
    const {year,month,offset}:{year:number,month:number,offset:number}={month:Months[(searchParams.get("month") || "January") as keyof typeof Months],year:parseInt(searchParams.get("year") || "2024"),offset:parseInt(searchParams.get("offset") || "0")};
  try{
    const query={date:{$gt:new Date(`${year}-${month<10?`0${month}`:month}-01T00:00:00.000Z`),$lt:new Date(`${year+(month==12?1:0)}-${(month+1)%12>9?(month+1)%12:`0${(month+1)%12}`}-01T00:00:00.000Z`)}};
    const articles=await News.find(query,{content:0}).sort({date:-1}).limit(7).skip(offset);
      return NextResponse.json(articles, { status: 200 });
  }
  catch(error){
        return NextResponse.json({error},{status:500});
  }
}