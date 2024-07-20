import { connect } from "@/database/dbConfig";
import Author from "@/models/AuthorModel";
import { NextRequest, NextResponse } from "next/server";
import { getAuthorFromHeader } from "../edit_news/route";
import { News } from "@/models/NewsModel";
import path from "path";
import { unlink, writeFile } from "fs/promises";
import { nanoid } from "@reduxjs/toolkit";
connect();
export async function GET(req: NextRequest) {
    try {
        let tempAuthor = await getAuthorFromHeader(req);
        if (tempAuthor == null) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        else{
            let author = await Author.findById(tempAuthor._id,{name:1,email:1,bio:1,profilePic:1,socialLinks:1,createdOn:1,isSuperAdmin:1,sessionToken:1});
            if(author && author.sessionToken==tempAuthor.sessionToken){
                delete author.sessionToken;
                return NextResponse.json(author, { status: 200 });
            }
            else if(author==null){
                return NextResponse.json({ error: "Author not found" }, { status: 404 });
            }
            else if(author.sessionToken!=tempAuthor.sessionToken){
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }
    } catch (error) {
        NextResponse.json({ error }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {
    try{
        let tempAuthor = await getAuthorFromHeader(req);
        let author;
        if (tempAuthor == null) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        else{
            author = await Author.findById(tempAuthor._id,{name:1,email:1,bio:1,profilePic:1,socialLinks:1,createdOn:1,isSuperAdmin:1,sessionToken:1});
            if(author==null){
                return NextResponse.json({ error: "Author not found" }, { status: 404 });
            }
            else if(author.sessionToken!=tempAuthor.sessionToken){
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }
        const {name,bio,instagram,twitter,facebook}=await req.json();
        const socialLinks={instagram,twitter,facebook};
        if(instagram==null || instagram.length==0){
            delete socialLinks.instagram;
        }
        if(twitter==null || twitter.length==0){
            delete socialLinks.twitter;
        }
        if(facebook==null || facebook.length==0){
            delete socialLinks.facebook;
        }
        const updatedAuthor=await Author.findByIdAndUpdate(author._id,{name,bio,socialLinks},{projection:{_id:0,name:1,bio:1,socialLinks:1,email:1,profilePic:1,createdOn:1,isSuperAdmin:1},new:true});
        if(updatedAuthor){
            return NextResponse.json({author:updatedAuthor},{status:200});
        }
        else{
            return NextResponse.json({error:"Author not found"},{status:404});
        }        
    }catch(error){
        return NextResponse.json({error},{status:500});
    }
}
export async function PUT(req: NextRequest) {
    try{
        let tempAuthor = await getAuthorFromHeader(req);
        let author;
        if (tempAuthor == null) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        else{
            author = await Author.findById(tempAuthor._id,{name:1,email:1,bio:1,profilePic:1,socialLinks:1,createdOn:1,isSuperAdmin:1,sessionToken:1});
            if(author==null){
                return NextResponse.json({ error: "Author not found" }, { status: 404 });
            }
            else if(author.sessionToken!=tempAuthor.sessionToken){
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }
        const imageFile:File|null=(await req.formData()).get("image") as File;
        if(imageFile==null){
            return NextResponse.json({error:"Image not found"},{status:400});
        }
        const filename=nanoid()+".jpg";
        const filePath = path.join(process.cwd(), 'public/uploads/images', filename);
        // Read file buffer
        const fileBuffer = await imageFile.arrayBuffer();
        
        // Write file to disk
        await writeFile(filePath, Buffer.from(fileBuffer));
        const oldProfilePic:null|string=(await Author.findById(author._id,{profilePic:1})).profilePic;
        if(oldProfilePic!=null){
            await unlink(path.join(process.cwd(), 'public', oldProfilePic));
        }
        const updatedAuthor=await Author.findByIdAndUpdate(author._id,{profilePic:`/uploads/images/${filename}`},{projection:{_id:0,name:1,bio:1,socialLinks:1,email:1,profilePic:1,createdOn:1,isSuperAdmin:1},new:true});
        return NextResponse.json(updatedAuthor,{status:200});
    }catch(error){
        return NextResponse.json({error},{status:500});
    }
}
export async function DELETE(req: NextRequest) {
    try{
        let tempAuthor = await getAuthorFromHeader(req);
        let author;
        if (tempAuthor == null) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        else{
            author = await Author.findById(tempAuthor._id,{name:1,email:1,bio:1,profilePic:1,socialLinks:1,createdOn:1,isSuperAdmin:1,sessionToken:1});
            if(author==null){
                return NextResponse.json({ error: "Author not found" }, { status: 404 });
            }
            else if(author.sessionToken!=tempAuthor.sessionToken){
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }
        const oldProfilePic:null|string=(await Author.findById(author._id,{profilePic:1})).profilePic;
        if(oldProfilePic!=null){
            await unlink(path.join(process.cwd(), 'public', oldProfilePic));
        }
        const updatedAuthor=await Author.findByIdAndUpdate(author._id,{profilePic:null},{projection:{_id:0,name:1,bio:1,socialLinks:1,email:1,profilePic:1,createdOn:1,isSuperAdmin:1},new:true});
        return NextResponse.json(updatedAuthor,{status:200});
    }
    catch(error){
        return NextResponse.json({error},{status:500});
    }
}