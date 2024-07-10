import { connect } from "@/database/dbConfig";
import Author from "@/models/AuthorModel";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(req: NextRequest) {
    try {
        const {email}=await req.json();
        let author=new Author({email});
        author = await author.save();
        return NextResponse.json({success:true,author},{status:200});
    } catch (error) {
        return NextResponse.json({error},{status:500});
    }
}