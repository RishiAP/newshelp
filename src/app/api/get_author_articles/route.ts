import { connect } from "@/database/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getAuthorFromHeader } from '@/helpers/common_func';
import { Author, News } from "@/models/NewsModel";
connect();
function addDays(date:Date|string, days:number):Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}
export async function POST(req: NextRequest) {
    try {
        let tempAuthor = await getAuthorFromHeader(req);
        if (tempAuthor == null) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        else{
            let author=await Author.findById(tempAuthor._id,{_id:1,isSuperAdmin:1,sessionToken:1});
            if(author==null || author.sessionToken!=tempAuthor.sessionToken){
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            const {date,category,priority,lastDate}=await req.json();
            const toDate=new Date(date);
            const query:{author:String,category?:string,priority?:string,createdOn?:{$gt?:Date,$lt:Date}}={author:tempAuthor._id,category,priority};
            if(date!="" || lastDate!=null){
                if(lastDate==null)
                query.createdOn={$gt:toDate,$lt:addDays(toDate,1)};
                else if(date=="")
                query.createdOn={$lt:lastDate};
                else
                query.createdOn={$gt:toDate,$lt:lastDate};
            }
            if(category=="all")
                delete query.category;
            if(priority=="none")
                delete query.priority;
            const articles=await News.find(query,{_id:0,title:1,slug:1,createdOn:1,priority:1,metadesc:1,topimage:1}).sort({createdOn:-1}).limit(5).populate("category");
            if(articles){
                return NextResponse.json(articles, { status: 200 });
            }
            else{
                return NextResponse.json({ error: "Author not found" }, { status: 404 });
            }
        }
    } catch (error) {
        NextResponse.json({ error }, { status: 500 });
    }
}