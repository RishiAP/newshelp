"use client";
import { Article_without_content } from '@/app/page';
import Footer from '@/components/Footer';
import MainWindow from '@/components/MainWindow';
import Navbar from '@/components/Navbar';
import { Author_Details } from '@/components/SideElement';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
export type Article={
  title:string,
  metadesc:string,
  content:Object,
  topimage:string,
  category:string,
  createdOn:string,
  dateUpdated?:string,
  views:number,
  slug:string,
  author:Author_Details
}
export default function Page({params}:{params: {category:string}}){
  const [articles, setArticles] = useState<Article_without_content[]|null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [scrollLoading, setScrollLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    localStorage.setItem('shouldFetch',"true");
    axios.get(`/api/get_articles?category=${params.category}&datetime=NONE`).then((res) => {
      console.log(res.data);
      setArticles(res.data);
      setLoading(false);
      });
    }, [])
    useEffect(()=>{
      const mainWindow=document.getElementById("mainWindowDiv");
      window.onscroll=()=>{
        if(articles && articles.length>6 && window.location.href.split("/")[3]=="categories"){
          if((mainWindow?.scrollHeight || 0)+(mainWindow?.getBoundingClientRect().y || 0)<window.innerHeight+300){
            if(localStorage.getItem('shouldFetch')=="true"){
              setScrollLoading(true);
              axios.get(`/api/get_articles?category=${params.category}&datetime=${encodeURIComponent(articles[articles.length-1]?.createdOn || "NONE")}`).then((res) => {
                setArticles([...articles,...res.data]);
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
    },[articles])
    
  return (
    <>
    <Navbar currentActive={params.category} setLoading={setLoading}/>
    <div className="container">
    <MainWindow newsExist={false} articles={articles} loading={loading} alertMessage={alertMessage} setLoading={setLoading} scrollLoading={scrollLoading} showRescents={false}/>
    </div>
    <Footer/>
    </>
  )
}