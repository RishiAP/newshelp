import { initAdmin } from '@/config/firebase/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from "jsonwebtoken";
import { connect } from '@/database/dbConfig';
import Author from '@/models/AuthorModel';
connect();
export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ error: 'No token provided' }, { status: 400 });
  }

  try {
    const firebaseAdmin=await initAdmin()
    const decodedToken = await (firebaseAdmin).auth().verifyIdToken(idToken);
    let author=await Author.findOne({email:decodedToken.email});
    if(author==null){
        await firebaseAdmin.auth().deleteUser(decodedToken.uid); 
      return NextResponse.json({error:"User not found"},{status:404});
    }
    const token=jwt.sign({_id:author._id,sessionToken:author.sessionToken},String(process.env.JWT_SECRET));
    const serialized=serialize("jwtAccessToken",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV=="production",
        // secure:false,
        sameSite:"strict",
        maxAge:60*60*24*30,
        path:"/"
    })
    return NextResponse.json({message:"Logged in successfully"}, { status: 200,
        headers: {'Set-Cookie': serialized}
    });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}