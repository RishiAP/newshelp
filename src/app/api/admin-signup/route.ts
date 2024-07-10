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
        let author;
        author=await Author.findOne({email:data.email});
        if(author && "verified" in author && author.verified){
            return NextResponse.json({message:"Email already verified"}, { status: 409 });
        }
        else if(author==null){
            return NextResponse.json({message:"Email not found"}, { status: 404 });
        }
        author =await Author.findOneAndUpdate({email:data.email},{verifyToken:token,verificationExpiryTime:Date.now()+1200000});
        const email_sent=await sendEmail('"Debjyoti Mondal 👻" <myqdiscuss@outlook.com>',data.email,"Create your News account",`Your email has been registered with us. Please click on the link to continue http://${process.env.NEXT_PUBLIC_DOMAIN}/admin-signup?token=${token}`,`<div>Your email has been registered with us. Please click on the link below to continue<a href="${process.env.NEXT_PUBLIC_DOMAIN}/admin-signup?token=${token}">${process.env.NEXT_PUBLIC_DOMAIN}/admin-signup?token=${token}</a></div>`);
        console.log(email_sent);
        return NextResponse.json({message:"email sent"}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}