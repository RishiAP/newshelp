import { connect } from "@/database/dbConfig";
import Author from "@/models/AuthorModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { nanoid } from "@reduxjs/toolkit";
connect();
export async function POST(req: NextRequest) {
    try {
        const {email,password,token} = await req.json();
        if(!token || token.length!=parseInt(process.env.VERIFY_TOKEN_LENGTH? process.env.VERIFY_TOKEN_LENGTH:"32")){
            return NextResponse.json({message:"Resetting unsuccessful"}, { status: 401 });
        }
        let author=await Author.findOne({email,forgetPassToken:token,forgetPassTokenExpiryTime:{$gt:Date.now()-1200000}});
        let hash,salt,saltRounds=10,sessionToken;
        if(author){
            salt = bcrypt.genSaltSync(saltRounds);
            hash = bcrypt.hashSync(password, salt);
            sessionToken=nanoid(32);
            await Author.findOneAndUpdate({email},{password:hash,sessionToken,forgetPassToken:null,forgetPassTokenExpiryTime:null});
        }
        else{
            return NextResponse.json({message:"Resetting unsuccessful"}, { status: 401 });
        }
        return NextResponse.json({message:"Password reseted successfully"}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}