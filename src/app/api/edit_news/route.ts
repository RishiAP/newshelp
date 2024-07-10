import { connect } from '@/database/dbConfig';
import { NextRequest, NextResponse } from "next/server";
import { News, Category } from "@/models/NewsModel";
import axios from 'axios';
import { nanoid } from '@reduxjs/toolkit';
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";
import { parse } from 'cookie';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Author from '@/models/AuthorModel';
connect();
async function getAuthorFromHeader(req: NextRequest): Promise<String | null> {
    const cookies = parse(req.headers.get('cookie') || '');
    if (cookies.jwtAccessToken && cookies.jwtAccessToken.length > 0) {
        try {
            const secret = process.env.JWT_SECRET || '';
            const decoded = jwt.verify(cookies.jwtAccessToken, secret) as JwtPayload;
            return decoded.email as String;
        } catch (err) {
            console.error('JWT verification failed:', err);
        }
    }
    return null;
}
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
async function translateForSlug(title: string) {
    const options = {
        method: 'POST',
        url: 'https://google-translator9.p.rapidapi.com/v2',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_GOOGLE_TRANSLATE_KEY,
            'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            q: title,
            source: 'hi',
            target: 'en',
            format: 'text'
        }
    };
    return (await axios.request(options)).data.data.translations[0].translatedText;
}
async function addImagesInContent(data: { content: { ops: any[] } }) {
    let file, buffer, filename, i, ext;
    for (i = 0; i < data.content.ops.length; i++) {
        if (data.content.ops[i].hasOwnProperty('insert') && data.content.ops[i].insert.hasOwnProperty('image') && data.content.ops[i].insert.image.startsWith('data:image')) {
            ext = data.content.ops[i].insert.image.split(';')[0].split('/')[1];
            filename = nanoid() + "." + (ext == "svg+xml" ? "svg" : ext);
            file = dataURLtoFile(data.content.ops[i].insert.image, filename);
            buffer = Buffer.from(await file.arrayBuffer());
            await writeFile(
                path.join(process.cwd(), "public/uploads/images/" + filename),
                buffer
            );
            data.content.ops[i].insert.image = `/uploads/images/${filename}`;
        }
    }
}
async function generateMetaDesc(data: { metadesc: string, content: { ops: any[] } }) {
    let i = 0;
    while (data.metadesc.length < 150) {
        if (data.content.ops[i] == null)
            break;
        if (data.content.ops[i].hasOwnProperty('insert') && typeof (data.content.ops[i].insert) == 'string') {
            data.metadesc += data.content.ops[i].insert.substring(0, 150 - data.metadesc.length);
        }
        i++;
    }
}
async function setTopImage(data: { topimage: string }) {
    let file, buffer, filename, i, ext;
    ext = data.topimage.split(';')[0].split('/')[1];
    filename = nanoid() + "." + (ext == "svg+xml" ? "svg" : ext);
    file = dataURLtoFile(data.topimage, filename);
    buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(
        path.join(process.cwd(), "public/uploads/images/" + filename),
        buffer
    );
    data.topimage = `/uploads/images/${filename}`;
}
function setDifference(setA: string[], setB: string[]): Set<string> {
    let difference = new Set(setA);
    for (let elem of setB) {
        difference.delete(elem);
    }
    return difference;
}
async function removeImage(image: string) {
    const filePath = path.join(process.cwd(), "public/uploads/images/" + image.split("/").pop());
    fs.unlinkSync(filePath);
}
async function removeUnusedImages(data: { content: { ops: any[] }, topimage: string }, slug: string) {
    if (data.topimage.startsWith('data:image')) {
        await removeImage((await News.findOne({ slug: slug }, { topimage: 1 })).topimage);
    }
    let i = 0;
    const pipeline = [
        { $match: { slug: slug } }, // Match documents with the specified slug
        { $unwind: "$content.ops" }, // Unwind the ops array to handle each element separately
        { $match: { "content.ops.insert.image": { $exists: true } } }, // Match only the objects that have an image key
        { $group: { _id: null, images: { $push: "$content.ops.insert.image" } } } // Group the results into an array of strings
    ];

    // Perform the aggregation
    const preImages = await News.aggregate(pipeline).exec();
    console.log(preImages);
    if (preImages.length == 0)
        return;
    const currentImages = data.content.ops.filter((op: any) => op.hasOwnProperty('insert') && op.insert.hasOwnProperty('image')).map((op: any) => op.insert.image);
    const imagesToBeRemoved: Set<string> = setDifference(preImages[0].images, currentImages);
    imagesToBeRemoved.forEach(async (image: string) => {
        if (image.startsWith("/upload/images/")) {
            await removeImage(image);
        }
    });
}
export async function POST(req: NextRequest) {
    let data = await req.json();
    const author = await getAuthorFromHeader(req);
    if (author == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        if (data.priority == "TopMost" && await News.findOne({ priority: 'TopMost', date: { $gte: startOfDay, $lte: endOfDay } })) {
            return NextResponse.json({ error: "Topmost article already exists for today" }, { status: 422 });
        }
        data.author = await Author.findOne({ email: author });
        data.slug = slugify(await translateForSlug(data.title));
        data.category = (await Category.findOne({ value: data.category }))._id;
        await addImagesInContent(data);
        data.metadesc = "";
        await generateMetaDesc(data);
        if (data.topimage.startsWith('data:image')) {
            await setTopImage(data);
            const newNews = new News(data);
            const savedNews = await newNews.save();
            return NextResponse.json(data, { status: 200 });
        }
        else {
            return NextResponse.json({ error: "Invalid Top Image" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
export async function GET(req: NextRequest) {
    try {
        const article = await News.findOne({ slug: req.nextUrl.searchParams.get("slug") }).populate("category");
        return NextResponse.json(article, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}
export async function PUT(req: NextRequest) {
    try {
        const slug: string = req.nextUrl.searchParams.get("slug") || "";
        const data = await req.json();
        data.slug = slugify(await translateForSlug(data.title));
        data.category = (await Category.findOne({ value: data.category }))._id;
        data.dateUpdated = new Date();
        await addImagesInContent(data);
        data.metadesc = "";
        await generateMetaDesc(data);
        await removeUnusedImages(data, slug);
        if (data.topimage.startsWith('data:image')) {
            await setTopImage(data);
        }
        const article = await News.findOneAndUpdate({ slug: slug }, data, { new: true });
        return NextResponse.json(article, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(error, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const slug: string = req.nextUrl.searchParams.get("slug") || "";
        const article = await News.findOneAndDelete({ slug: slug });
        await removeImage(article.topimage);
        article.content.ops.filter((op: any) => op.hasOwnProperty('insert') && op.insert.hasOwnProperty('image')).map((op: any) => op.insert.image).forEach(async (image: string) => {
            if (image.startsWith("/upload/images/")) {
                await removeImage(image);
            }
        });
        return NextResponse.json(article, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}