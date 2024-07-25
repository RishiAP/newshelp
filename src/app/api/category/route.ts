import { connect } from "@/database/dbConfig";
import { Category } from "@/models/NewsModel";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  await connect();
  try{
      const categories=await Category.find();
      return NextResponse.json(categories, { status: 200 });
  }
  catch(error){
        return NextResponse.json({error},{status:500});
  }
}
export async function POST(req: NextRequest) {
  try{
      const {name}=await req.json();
      if(name==null || name.length==0){
          return NextResponse.json({error:"Name is required"},{status:400});
      }
      return NextResponse.json({name,message:"Authority missing! Can't create category like this."}, { status: 405 });
  }
  catch(error){
      return NextResponse.json({error},{status:500});
  }
}