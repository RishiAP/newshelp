"use client";
import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import SideElement from './SideElement'
import NewsCard from './NewsCard'
import { Article } from '@/app/categories/[category]/page';
import ContentLoadSpinner from './ContentLoadSpinner';
const MainWindow = (props:{news?:{slug:string,title:string,metadesc:string,content:Object,topimage:string,category:string,date:string,views:number,dateUpdated?:string,author:{name:String,profilePic:string|null}},articles:Article[],newsExist:boolean,loading:boolean,setLoading?:React.Dispatch<React.SetStateAction<boolean>>,alertMessage?:string,scrollLoading?:boolean,showRescents:boolean,isArchive?:boolean,archiveDate?:{month:string,year:string},showSideElement?:boolean}) => {
  const [shouldDisplayArticles, setShouldDisplayArticles] = useState(true);
  const loadLoader=()=>{
    if(props.setLoading)
      props.setLoading(true);
    else{
      document.getElementById("mainWindowDiv")?.querySelector(".content-load-spinner")?.classList.remove("d-none");
      document.getElementById("mainWindowDiv")?.querySelector(".content-load-spinner")?.classList.add("d-flex");
    }
  }

  return (
    <div className='row g-5'>
      <div id="mainWindowDiv" className="col-md-8">
        {
          (props.isArchive!=null && props.isArchive)?<h1 className="mb-4">{`${props.archiveDate?.month} ${props.archiveDate?.year}`} Archives</h1>:null
        }
        <div id="articles" className={shouldDisplayArticles?"":"d-none"}>
      {
        props.newsExist?<NewsItem news={props.news} newsExist={props.newsExist}/>:<>{
          props.articles.map((article:any) => {
            return <NewsCard key={article._id} article={article} onClick={()=>{setShouldDisplayArticles(false); loadLoader();}}/>
          })
          
        }</>
      }
      </div>
      <ContentLoadSpinner loading={props.loading} classProperties='vw-100 vh-100 align-items-center position-fixed top-0 start-0' style={{zIndex:2,background:"rgb(255 255 255 / 25%)"}}/>
      <ContentLoadSpinner loading={props.scrollLoading || false} classProperties='w-100'/>
      <div className={`${(props.alertMessage=="" || !shouldDisplayArticles) ? "d-none":""} alert alert-primary text-center`} role="alert">
  {props.alertMessage}
</div>
      </div>
      {
        (!("showSideElement" in props) || props.showSideElement!=false) ? <SideElement showRecents={props.showRescents} author={props.news?.author} />:null
      }
    </div>
  )
}

export default MainWindow