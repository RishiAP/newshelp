"use client";
import { Article_without_content } from '@/app/page';
import React from 'react'
import NewsCard from './NewsCard';
import Link from 'next/link';

const TopNews = (props:{topMostNews:Article_without_content|null,headlines:Article_without_content[]|null,setLoading?:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const loadLoader=()=>{
    if(props.setLoading)
      props.setLoading(true);
    else{
      document.getElementById("mainWindowDiv")?.querySelector(".content-load-spinner")?.classList.remove("d-none");
      document.getElementById("mainWindowDiv")?.querySelector(".content-load-spinner")?.classList.add("d-flex");
    }
  }
  return (
    <>
    {
      props.headlines==null || props.topMostNews!=null || props.headlines.length>0?
      <>
      {
        props.topMostNews==null?null:<div id='topMostNews' className="p-4 mb-4 position-relative rounded text-body-emphasis bg-body-secondary d-flex align-items-center gap-2">
        <div className="px-0">
          <h1 className="display-5 fst-italic">{props.topMostNews.title}</h1>
          <p className="lead my-3">{props.topMostNews.metadesc}...</p>
          <p className="lead mb-0"><Link href={`/${props.topMostNews.slug}`} className="text-body-emphasis fw-bold stretched-link" onClick={()=>{loadLoader()}}>Continue reading...</Link></p>
        </div>
        <img id='topMostNewsImage' src={props.topMostNews.topimage} alt="" style={{objectFit:"contain",maxWidth:"500px",width:"50%"}} />
      </div>
      }
    <div id='articles' className="row mb-2">
      {
        props.headlines && props.headlines.map((news,index)=>{
          return (
            <NewsCard key={index} article={news} onClick={()=>{loadLoader()}} />
          )
        })
      }
    </div>
      </>:<h1>No articles found!</h1>
    }
    
    </>
  )
}

export default TopNews