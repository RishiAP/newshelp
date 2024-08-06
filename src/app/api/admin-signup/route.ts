import { connect } from "@/database/dbConfig";
import sendEmail from "@/helpers/mailer";
import Author from "@/models/AuthorModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import EmailTemplate from "@/components/EmailTemplate";
connect();
export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const token=crypto.randomBytes(parseInt(process.env.VERIFY_TOKEN_LENGTH? process.env.VERIFY_TOKEN_LENGTH:"32")).toString('hex');
        let author;
        author=await Author.findOne({email:data.email});
        if(author && "verified" in author && author.verified){
            return NextResponse.json({message:"Email already verified"}, { status: 409 });
        }
        else if(author==null){
            return NextResponse.json({message:"Email not found"}, { status: 404 });
        }
        author =await Author.findOneAndUpdate({email:data.email},{verifyToken:token,verificationExpiryTime:Date.now()+1200000});
        const emailHtml=EmailTemplate({link:`${process.env.NEXT_PUBLIC_DOMAIN}/admin-signup?token=${token}`,message:"Your email has been registered with us. Please click on the button below to continue",buttonText:"Create account"});
        const email_sent=await sendEmail(`"News Website" <${process.env.SMTP_NOREPLY}>`,data.email,"Create your News account",`Your email has been registered with us. Please click on the link to continue http://${process.env.NEXT_PUBLIC_DOMAIN}/admin-signup?token=${token}`,emailHtml);
        return NextResponse.json({message:"email sent"}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}