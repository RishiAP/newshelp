"use client";
import Footer from '@/components/Footer';
import MainWindow from '@/components/MainWindow';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
export type Article={
  title:string,
  metadesc:string,
  content:Object,
  topimage:string,
  category:string,
  date:string
}
export default function Page({params}:{params: {category:string}}){
  const [articles, setArticles] = useState<[Article?]>([]);
  useEffect(() => {
      localStorage.setItem('shouldFetch',"true");
      axios.get(`/api/get_articles?category=${params.category}&datetime=NONE`).then((res) => {
        setArticles(res.data);
      });
    }, [])
    useEffect(()=>{
      const mainWindow=document.getElementById("mainWindowDiv");
      window.onscroll=()=>{
        if(window.location.href.includes("categories")){
          if((mainWindow?.scrollHeight || 0)+(mainWindow?.getBoundingClientRect().y || 0)<window.innerHeight+300){
            if(localStorage.getItem('shouldFetch')=="true"){
              axios.get(`/api/get_articles?category=${params.category}&datetime=${encodeURIComponent(articles[articles.length-1]?.date || "NONE")}`).then((res) => {
                setArticles([...articles,...res.data]);
                if(res.data.length==0){
                  localStorage.setItem('shouldFetch',"false");
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
    <Navbar currentActive={params.category} />
    <div className="container">
    <MainWindow news={{title:"",category:"",content:{},date:"",metadesc:"",topimage:""}} newsExist={false} articles={articles} />
    </div>
    <Footer/>
    </>
  )
}