import { connect } from "@/database/dbConfig";
import sendEmail from "@/helpers/mailer";
import Author from "@/models/AuthorModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
connect();
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const token=crypto.randomBytes(32).toString('hex');
        const author=await Author.findOneAndUpdate({email:data.email},{forgetPassToken:token,forgetPassTokenExpiryTime:Date.now()+1200000});
        if(author==null){
            return NextResponse.json({message:"Email not found"}, { status: 404 });
        }
        const email_sent=await sendEmail('"Debjyoti Mondal 👻" <myqdiscuss@outlook.com>',data.email,"Reset your News Password",`Please use the link to reset your password : http://${process.env.NEXT_PUBLIC_DOMAIN}/reset-pass?token=${token}`,`<div>Please click on the link below to reset your password : <a href="${process.env.NEXT_PUBLIC_DOMAIN}/reset-pass?token=${token}">${process.env.NEXT_PUBLIC_DOMAIN}/reset-pass?token=${token}</a></div>`);
        console.log(email_sent);
        return NextResponse.json({message:"email sent"}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}