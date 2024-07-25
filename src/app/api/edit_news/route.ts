import { connect } from '@/database/dbConfig';
import { NextRequest, NextResponse } from "next/server";
import { News, Category } from "@/models/NewsModel";
import axios from 'axios';
import Author from '@/models/AuthorModel';
import { getAuthorFromHeader } from '@/helpers/common_func';
import { deleteImageFormURL, uploadImage } from '@/helpers/sanity';
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
    let i;
    for (i = 0; i < data.content.ops.length; i++) {
        if (data.content.ops[i].hasOwnProperty('insert') && data.content.ops[i].insert.hasOwnProperty('image') && data.content.ops[i].insert.image.startsWith('data:image')) {
            data.content.ops[i].insert.image = await uploadImage(data.content.ops[i].insert.image);
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
    data.topimage = await uploadImage(data.topimage);
}
function setDifference(setA: string[], setB: string[]): Set<string> {
    let difference = new Set(setA);
    for (let elem of setB) {
        difference.delete(elem);
    }
    return difference;
}
async function removeUnusedImages(data: { content: { ops: any[] }, topimage: string }, slug: string) {
    if (data.topimage.startsWith('data:image')) {
        await deleteImageFormURL((await News.findOne({ slug: slug }, { topimage: 1 })).topimage);
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
    if (preImages.length == 0)
        return;
    const currentImages = data.content.ops.filter((op: any) => op.hasOwnProperty('insert') && op.insert.hasOwnProperty('image')).map((op: any) => op.insert.image);
    const imagesToBeRemoved: Set<string> = setDifference(preImages[0].images, currentImages);
    imagesToBeRemoved.forEach(async (image: string) => {
        if (image.startsWith("https://cdn.sanity.io")) {
            await deleteImageFormURL(image);
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
        data.author = await Author.findById(author._id);
        if(data.author==null || data.author.sessionToken!=author.sessionToken){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        if (data.priority == "TopMost" && await News.findOne({ priority: 'TopMost', createdOn: { $gte: startOfDay, $lte: endOfDay } })) {
            return NextResponse.json({ error: "Topmost article already exists for today" }, { status: 422 });
        }
        if(data.priority=="null")
            data.priority=null;
        data.slug = slugify(await translateForSlug(data.title));
        data.category = (await Category.findOne({ value: data.category }))._id;
        await addImagesInContent(data);
        data.metadesc = "";
        await generateMetaDesc(data);
        if (data.topimage.startsWith('data:image')) {
            await setTopImage(data);
            const newNews = new News(data);
            const savedNews = await newNews.save();
            return NextResponse.json(savedNews, { status: 200 });
        }
        else {
            return NextResponse.json({ error: "Invalid Top Image" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
async function checkPermission(slug:string,req:NextRequest):Promise<true|string|undefined>{
    let tempAuthor=await getAuthorFromHeader(req);
    if (tempAuthor == null) {
        return "Unauthorized";
    }
    else{
        let author=await Author.findById(tempAuthor._id,{_id:1,isSuperAdmin:1,sessionToken:1});
        if(author==null || author.sessionToken!=tempAuthor.sessionToken){
            return "Unauthorized";
        }
        if(!author.isSuperAdmin){
            const actualAuthor=(await News.findOne({slug:slug},{author:1}).populate("author")).author._id as string;
            if(actualAuthor!=author._id)
            return "Permission Denied! You are not the author of this article";
            else
            return true;
        }
        else
        return true;
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
        const permission=await checkPermission(slug,req);
        if(permission!=true){
            if(permission=="Unauthorized")
            return NextResponse.json({ error: permission }, { status: 401 });
            else
            return NextResponse.json({ error: permission }, { status: 403 });
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const data = await req.json();
        const news=await News.findOne({ priority: 'TopMost', createdOn: { $gte: startOfDay, $lte: endOfDay }},{slug:1});
        if (data.priority == "TopMost" && news && news.slug!=slug) {
            return NextResponse.json({ error: "Topmost article already exists for today" }, { status: 422 });
        }
        if(data.priority=="null")
            data.priority=null;
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
        return NextResponse.json(error, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const slug: string = req.nextUrl.searchParams.get("slug") || "";
        const permission=await checkPermission(slug,req);
        if(permission!=true){
            if(permission=="Unauthorized")
            return NextResponse.json({ error: permission }, { status: 401 });
            else
            return NextResponse.json({ error: permission }, { status: 403 });
        }
        const article = await News.findOneAndDelete({ slug: slug });
        await deleteImageFormURL(article.topimage);
        article.content.ops.filter((op: any) => op.hasOwnProperty('insert') && op.insert.hasOwnProperty('image')).map((op: any) => op.insert.image).forEach(async (image: string) => {
            if (image.startsWith("https://cdn.sanity.io")) {
                await deleteImageFormURL(image);
            }
        });
        return NextResponse.json(article, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}