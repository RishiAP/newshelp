"use client";
import React from 'react'
import NewsItem from './NewsItem'
import SideElement from './SideElement'
import NewsCard from './NewsCard'
import SpinnerHandler from './SpinnerHandler';
import { Article } from '@/app/categories/[category]/page';
const MainWindow = (props:{news:{title:string,metadesc:string,content:Object,topimage:string,category:string,date:string},articles:[Article?],newsExist:boolean}) => {
  return (
    <div className='row g-5'>
      <div id="mainWindowDiv" className="col-md-8">
      {
          props.newsExist?<NewsItem news={props.news} newsExist={props.newsExist}/>:<>{
              props.articles.map((article:any) => {
              return <NewsCard key={article._id} article={article}/>
            })
          
          }</>
      }
      </div>
    <SideElement/>
    <SpinnerHandler/>
    </div>
  )
}

export default MainWindow