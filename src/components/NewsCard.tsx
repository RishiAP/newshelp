"use client";
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
const NewsCard = (props:{article:{title:string,topimage:string,date:string,metadesc:string,slug:string},onClick?:any}) => {
  return (
    <div className="card news-card mb-3" style={{height:"fit-content"}} onClick={props.onClick}>
  <div className="row g-0">
    <div className="col-md-4 d-flex justify-content-center align-items-center">
        <Link href={"/"+props.article.slug} className='stretched-link'>
      <img src={props.article.topimage} className="img-fluid rounded-start" alt="..."/>
        </Link>
    </div>
    <div className="col-md-8">
      <div className="card-body">
        <h5 className="card-title fs-3">{props.article.title}</h5>
        <p className="card-text fs-6">{props.article.metadesc+"..."}</p>
        <p className="card-text"><small className="text-body-secondary">{new Date(props.article.date).toString()}</small></p>
      </div>
    </div>
  </div>
</div>
  )
}

export default NewsCard