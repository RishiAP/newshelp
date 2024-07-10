import Footer from "@/components/Footer";
import MainWindow from "@/components/MainWindow";
import Navbar from "@/components/Navbar";
import TopNews from "@/components/TopNews";
import { connect } from "@/database/dbConfig";
import { News } from "@/models/NewsModel";
connect();
// import axios from "axios";
// import { useEffect, useState } from "react";
export type Article_without_content={
  title:string,
  slug:string,
  topimage:string,
  metadesc:string,
  category:String | {_id:Object,value:String},
  date:string,
  views:number,
  dateUpdated?:string,
}

export default async function Home() {
  const topMostNews=JSON.parse(JSON.stringify((await News.find({priority:"TopMost"},{content:0}).sort({date:-1}).limit(1))[0]));
  const headlines=JSON.parse(JSON.stringify(await News.find({priority:"Headline"},{content:0}).sort({date:-1}).limit(5).populate("category")));
  return (
    <>
      <Navbar currentActive="headlines"/>
      <div className="container">
        <TopNews topMostNews={topMostNews} headlines={headlines} />
        <MainWindow showSideElement={false} newsExist={false} news={{title:"",slug:"",content:{},topimage:"",metadesc:"",category:"",date:"",views:0,author:{name:"",profilePic:null}}} articles={[]} loading={false} showRescents={true}  />
      </div>
      <Footer/>
    </>
  );
}
