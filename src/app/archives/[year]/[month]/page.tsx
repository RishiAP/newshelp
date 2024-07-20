"use client";
import { Article_without_content } from '@/app/page';
import Footer from '@/components/Footer';
import MainWindow from '@/components/MainWindow';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Archives({params}:{params:{year:string,month:string}}){
  const [articles, setArticles] = useState<Article_without_content[]|null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    localStorage.setItem('shouldFetch',"true");
    axios.get(`/api/get_archives?year=${params.year}&month=${params.month}`).then((res) => {
      setArticles(res.data);
      console.log(res.data);
      setLoading(false);
      }
    );
  } , []);
  useEffect(()=>{
    const mainWindow=document.getElementById("mainWindowDiv");
    window.onscroll=()=>{
      if(articles && articles.length>6 && window.location.href.split("/")[3]=="archives"){
        if((mainWindow?.scrollHeight || 0)+(mainWindow?.getBoundingClientRect().y || 0)<window.innerHeight+300){
          if(localStorage.getItem('shouldFetch')=="true"){
            setScrollLoading(true);
            axios.get(`/api/get_archives?year=${params.year}&month=${params.month}&offset=${articles.length}`).then((res) => {
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
  },[articles]);

  return (
    <>
    <Navbar currentActive='' setLoading={setLoading}/>
    <div className="container">
    <MainWindow newsExist={false} articles={articles} loading={loading} alertMessage={alertMessage} setLoading={setLoading} scrollLoading={scrollLoading} showRescents={false} isArchive={true} archiveDate={{month:params.month,year:params.year}} />
    </div>
    <Footer/>
    </>
  )
}
