import { connect } from "@/database/dbConfig";
import { Category } from "@/models/NewsModel";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(req: NextRequest) {
  const body = await req.json();
  try{
      const newCategory=new Category(body);
      const savedCategory=await newCategory.save();
      return NextResponse.json(savedCategory, { status: 200 });
  }
  catch(error){
        return NextResponse.json({error},{status:500});
  }
}
export async function GET(req: NextRequest) {
  try{
      const categories=await Category.find();
      return NextResponse.json(categories, { status: 200 });
  }
  catch(error){
        return NextResponse.json({error},{status:500});
  }
}