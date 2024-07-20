"use client";
import ContentLoadSpinner from "@/components/ContentLoadSpinner";
import Footer from "@/components/Footer";
import MainWindow from "@/components/MainWindow";
import Navbar from "@/components/Navbar";
import TopNews from "@/components/TopNews";
import axios from "axios";
import { useEffect, useState } from "react";
export type Article_without_content={
  title:string,
  slug:string,
  topimage:string,
  metadesc:string,
  category:String | {_id:Object,value:String},
  createdOn:string,
  views:number,
  dateUpdated?:string,
  priority?:null|string
}

export default function Home() {
  const [topMostNews, setTopMostNews] = useState<Article_without_content|null>(null);
  const [headlines, setHeadlines] = useState<Article_without_content[]|null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [scrollLoading, setScrollLoading] = useState(false);
  useEffect(() => {
    axios.get("/api/get_headlines").then((res) => {
      setLoading(false);
      setTopMostNews(res.data.topMostNews);
      setHeadlines(res.data.headlines);
      if(res.data.headlines.length>4){
        localStorage.setItem('shouldFetch',"true");
      }
    });
  },[]);
  useEffect(()=>{
    const mainWindow=document.getElementById("articles");
    window.onscroll=()=>{
      if(headlines && headlines.length>4){
        if((mainWindow?.scrollHeight || 0)+(mainWindow?.getBoundingClientRect().y || 0)<window.innerHeight+300){
          if(localStorage.getItem('shouldFetch')=="true"){
            setScrollLoading(true);
            axios.get(`/api/get_headlines?datetime=${encodeURIComponent(headlines[headlines.length-1]?.createdOn || "NONE")}`).then((res) => {
              setHeadlines([...headlines,...res.data]);
              if(res.data.length<7){
                localStorage.setItem('shouldFetch',"false");
                setScrollLoading(false);
                setAlertMessage("No more articles found");
              }
              else{
                localStorage.setItem('shouldFetch',"true");
              }
            });
            localStorage.setItem('shouldFetch',"false");
          }
        }
        
      }
    }
  },[headlines])
  return (
    <>
      <Navbar currentActive="headlines"/>
      <div className="container">
        <TopNews topMostNews={topMostNews} headlines={headlines} setLoading={setLoading} />
        <div className={`${alertMessage=="" ? "d-none":""} alert alert-primary text-center mt-3`} role="alert">
  {alertMessage}
</div>
<ContentLoadSpinner loading={loading} classProperties='vw-100 vh-100 align-items-center position-fixed top-0 start-0' style={{zIndex:2,background:"rgb(255 255 255 / 25%)"}}/>
        <ContentLoadSpinner loading={scrollLoading} classProperties='w-100'/>
      </div>
      <Footer/>
    </>
  );
}
