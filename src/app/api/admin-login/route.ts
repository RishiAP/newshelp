import { connect } from "@/database/dbConfig";
import Author from "@/models/AuthorModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from 'cookie';
connect();
export async function POST(req: NextRequest) {
    try {
        const {email,password} = await req.json();
        const author=await Author.findOne({email},{_id:1,sessionToken:1,password:1,verified:1});
        if(author==null)
            return NextResponse.json({message:"Email not found"}, { status: 404 });
        else if(!("verified" in author) || author.verified==false)
            return NextResponse.json({message:"Email not verified! Please verify the email first"}, { status: 401 });
        let token,serialized;
        if(bcrypt.compareSync(password, author.password)){
            token=jwt.sign({_id:author._id,sessionToken:author.sessionToken},String(process.env.JWT_SECRET));
            serialized=serialize("jwtAccessToken",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV=="production",
                sameSite:"strict",
                maxAge:60*60*24*30,
                path:"/"
            })
            return NextResponse.json({message:"Logged in successfully"}, { status: 200,
                headers: {'Set-Cookie': serialized}
            });
        }
        return NextResponse.json({message:"Incorrect password"}, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}