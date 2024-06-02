import { connect } from '@/database/dbConfig';
import { NextRequest, NextResponse } from "next/server";
import { News, Category } from "@/models/NewsModel";
import axios from 'axios';
import { nanoid } from '@reduxjs/toolkit';
import path from "path";
import { writeFile } from "fs/promises";
connect();
function slugify(str: string) {
    return String(str)
        .normalize('NFKD') // split accented characters into their base characters and diacritical marks
        .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
        .trim() // trim leading or trailing whitespace
        .toLowerCase() // convert to lowercase
        .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-'); // remove consecutive hyphens
}
function dataURLtoFile(dataurl: any, filename: string) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
export async function POST(req: NextRequest) {
    let data = await req.json();
    const options = {
        method: 'POST',
        url: 'https://google-translator9.p.rapidapi.com/v2',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_GOOGLE_TRANSLATE_KEY,
            'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            q: data.title,
            source: 'hi',
            target: 'en',
            format: 'text'
        }
    };
    let file, buffer, filename,i,ext;
    try {
        data.slug = slugify((await axios.request(options)).data.data.translations[0].translatedText);
        for(i=0;i<data.content.ops.length;i++){
            if (data.content.ops[i].hasOwnProperty('insert') && data.content.ops[i].insert.hasOwnProperty('image') && data.content.ops[i].insert.image.startsWith('data:image')) {
                ext=data.content.ops[i].insert.image.split(';')[0].split('/')[1];
                filename = nanoid() + "."+(ext=="svg+xml"?"svg":ext);
                file = dataURLtoFile(data.content.ops[i].insert.image, filename);
                buffer = Buffer.from(await file.arrayBuffer());
                await writeFile(
                    path.join(process.cwd(), "public/uploads/images/" + filename),
                    buffer
                );
                data.content.ops[i].insert.image = `/uploads/images/${filename}`;
            }
        }
        data.category = (await Category.findOne({value:data.category}))._id;
        data.metadesc="";
        i=0;
        while(data.metadesc.length<150){
            if(data.content.ops[i]==null)
                break;
            if(data.content.ops[i].hasOwnProperty('insert') && typeof(data.content.ops[i].insert)=='string'){
                data.metadesc+=data.content.ops[i].insert.substring(0,150-data.metadesc.length);
            }
            i++;
        }
        if(data.topimage.startsWith('data:image')){
            ext=data.topimage.split(';')[0].split('/')[1];
            filename = nanoid() + "."+(ext=="svg+xml"?"svg":ext);
            file = dataURLtoFile(data.topimage, filename);
            buffer = Buffer.from(await file.arrayBuffer());
            await writeFile(
                path.join(process.cwd(), "public/uploads/images/" + filename),
                buffer
            );
            data.topimage = `/uploads/images/${filename}`;
            const newNews = new News(data);
            const savedNews = await newNews.save();
            return NextResponse.json(savedNews, { status: 200 });
        }
        else{
            return NextResponse.json({error:"Invalid Top Image"}, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}