"use client";
import React from 'react'
import { timeAgo } from './NewsItem';
import Link from 'next/link';
import Image from 'next/image';
import { handleShare } from './NewsItem';
import { Article_without_content } from '@/app/page';
const NewsCard = (props:{article:Article_without_content,onClick?:any}) => {
  return (
    <div className="card news-card mb-3" style={{height:"fit-content"}}>
  <div className="row g-0">
    <div className="col-md-4 d-flex justify-content-start align-items-center">
        <Link href={"/"+props.article.slug} className='stretched-link' onClick={props.onClick} >
      <Image src={props.article.topimage} width={400} height={200} className="img-fluid rounded-start" alt="..." style={{maxWidth:"100%", maxHeight:"300px"}}/>
        </Link>
    </div>
    <div className="col-md-8">
      <div className="card-body">
        <div className='d-flex align-items-center gap-2'>
        {
          "category" in props.article && <strong className="d-inline-block text-primary-emphasis">{(props.article.category instanceof String)? props.article.category:props.article.category.value}</strong>
        }
        {
        "priority" in props.article && props.article.priority!=null && <span className='d-flex align-items-center gap-2'><span> | </span><span className={`badge bg-${props.article.priority=="TopMost"?'success':'danger'}`} style={{marginBottom:"0.1rem"}}>{props.article.priority=="TopMost"?"Top Most":props.article.priority}</span></span>
        }
        </div>
        <h5 className="card-title fs-3">{props.article.title}</h5>
        <p className="card-text fs-6">{props.article.metadesc+"..."}</p>
        <div className="card-text d-flex justify-content-between align-items-center">
          <div className="d-flex flex-wrap justify-content-between w-100 me-5">
          <small className="text-body-secondary me-4">Published : {timeAgo(props.article.createdOn)}</small>
          <small className="text-body-secondary">{props.article.dateUpdated? `Last updated : ${timeAgo(props.article.dateUpdated)}`:null}</small>
          </div>
          <div className='d-flex align-items-center gap-3' style={{zIndex:2}}>
          <Link href={`https://wa.me/?text=${process.env.NEXT_PUBLIC_DOMAIN}/${props.article.slug}`} target='_blank' style={{color:"#00E676"}}><i className="bi bi-whatsapp fs-5" aria-label='Share via WhatsApp'></i></Link>
          <Link href={`https://www.facebook.com/sharer.php?u=${process.env.NEXT_PUBLIC_DOMAIN}/${props.article.slug}`} target='_blank' style={{color:"#1877F2"}}><i className="bi bi-facebook fs-5" aria-label='Share via Facebook'></i></Link>
          <Link href={`https://twitter.com/intent/tweet?text=${process.env.NEXT_PUBLIC_DOMAIN}/${props.article.slug}`} target='_blank' style={{color:"#1DA1F2"}}><i className="bi bi-twitter fs-5" aria-label='Share via Twitter'></i></Link>
          <button type="button" style={{background:"none",border:"none",outline:"none",padding:"0px",color:"#712cf9"}} onClick={()=>{
            handleShare(props.article);
          }} title='Share Button' ><i className="bi bi-share fs-5"></i></button>
        </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default NewsCard