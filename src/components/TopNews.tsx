"use client";
import { Article_without_content } from '@/app/page';
import React, { useEffect } from 'react'
import NewsCard from './NewsCard';

const TopNews = (props:{topMostNews:Article_without_content,headlines:Article_without_content[]}) => {
  return (
    <>
    <div className="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary">
    <div className="col-lg-6 px-0">
      <h1 className="display-4 fst-italic">{props.topMostNews.title}</h1>
      <p className="lead my-3">{props.topMostNews.metadesc}...</p>
      <p className="lead mb-0"><a href={`/${props.topMostNews.slug}`} className="text-body-emphasis fw-bold">Continue reading...</a></p>
    </div>
  </div>
  <div className="row mb-2">
    {
      props.headlines.map((news,index)=>{
        return (
          <NewsCard key={index} article={news} />
        )
      })
    }
  </div>
    </>
  )
}

export default TopNews