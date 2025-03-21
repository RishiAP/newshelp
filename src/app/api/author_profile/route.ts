import { connect } from "@/database/dbConfig";
import Author from "@/models/AuthorModel";
import { NextRequest, NextResponse } from "next/server";
import { getAuthorFromHeader } from '@/helpers/common_func';
import { News } from "@/models/NewsModel";
import path from "path";
import { unlink, writeFile } from "fs/promises";
import { nanoid } from "@reduxjs/toolkit";
import { deleteImageFormURL, uploadImage } from "@/helpers/sanity";
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
        const { name, bio, socialLinks } = await req.json();

        // Create a mutable object for socialLinks or initialize it if it's null
        const updatedSocialLinks: Record<string, string | null> | null = socialLinks
        ? { ...socialLinks }
        : null;

        // Remove keys with `null` or empty string values, if socialLinks is not null
        if (updatedSocialLinks) {
            if (!updatedSocialLinks.instagram)
                delete updatedSocialLinks.instagram;
            if (!updatedSocialLinks.twitter)
                delete updatedSocialLinks.twitter;
            if (!updatedSocialLinks.facebook)
                delete updatedSocialLinks.facebook;
        }

        const updatedAuthor=await Author.findByIdAndUpdate(author._id,{name,bio,socialLinks:updatedSocialLinks},{projection:{_id:0,name:1,bio:1,socialLinks:1,email:1,profilePic:1,createdOn:1,isSuperAdmin:1},new:true});
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
        const {base64Image}=await req.json();
        if(base64Image==null){
            return NextResponse.json({error:"Image not found"},{status:400});
        }
        const imageURL=await uploadImage(base64Image);
        
        const oldProfilePic:null|string=(await Author.findById(author._id,{profilePic:1})).profilePic;
        if(oldProfilePic!=null){
            await deleteImageFormURL(oldProfilePic);
        }
        const updatedAuthor=await Author.findByIdAndUpdate(author._id,{profilePic:imageURL},{projection:{_id:0,name:1,bio:1,socialLinks:1,email:1,profilePic:1,createdOn:1,isSuperAdmin:1},new:true});
        return NextResponse.json(updatedAuthor,{status:200});
    }catch(error){
        console.log(error);
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
            await deleteImageFormURL(oldProfilePic);
        }
        const updatedAuthor=await Author.findByIdAndUpdate(author._id,{profilePic:null},{projection:{_id:0,name:1,bio:1,socialLinks:1,email:1,profilePic:1,createdOn:1,isSuperAdmin:1},new:true});
        return NextResponse.json(updatedAuthor,{status:200});
    }
    catch(error){
        return NextResponse.json({error},{status:500});
    }
}