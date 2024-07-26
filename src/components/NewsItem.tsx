"use client";
import React, { useEffect } from 'react';
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/app/categories/[category]/page';

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
function formatDate(date: Date): string {
  const dateZone=date.toString().split("(")[1].split(")")[0].split(" ").map((item)=>item[0]).join("");
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short', // e.g., "Thu"
    day: '2-digit', // e.g., "13"
    month: 'long', // e.g., "June"
    year: 'numeric', // e.g., "2024"
    hour: '2-digit', // e.g., "18"
    minute: '2-digit', // e.g., "35"
    hour12: false, // 24-hour format
  };

  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const parts = formatter.formatToParts(date).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {} as Record<string, string>);

  return `${parts.weekday} ${parts.day} ${parts.month} ${parts.year} at ${parts.hour}:${parts.minute} ${dateZone}`;
}
export const timeAgo=(date:string) =>{
  const now:any = new Date();
  const past:any = new Date(date);
  const secondsPast = (now - past) / 1000;

  const minutes = 60;
  const hours = minutes * 60;
  const days = hours * 24;
  const weeks = days * 7;
  const months = days * 30; // Approximate month
  const years = days * 365; // Approximate year

  if (secondsPast < minutes) {
    return `${Math.floor(secondsPast)} sec ago`;
  } else if (secondsPast < hours) {
    return `${Math.floor(secondsPast / minutes)} min ago`;
  } else if (secondsPast < days) {
    return `${Math.floor(secondsPast / hours)} hr ago`;
  } else if (secondsPast < weeks) {
    return `${Math.floor(secondsPast / days)} d ago`;
  } else if (secondsPast < months) {
    return `${Math.floor(secondsPast / weeks)} w ago`;
  } else if (secondsPast < years) {
    return `${Math.floor(secondsPast / months)} mon ago`;
  } else {
    return `${Math.floor(secondsPast / years)} yr ago`;
  }
}
export const handleShare=async ({title,metadesc,slug}:{title:string,metadesc:string,slug:string})=>{
  try {
    await navigator.share({
      title:title,
      text:metadesc,
      url:`${process.env.NEXT_PUBLIC_DOMAIN}/${slug}`
    });
  } catch (err) {
    console.log(err);
  }
}
const NewsItem = (props:{news?:Article,newsExist:boolean}) => {
  
  return (
    <div>
      <article className="blog-post position-relative">
        <h1 className="display-6 mb-1">{props.news?.title}</h1>
        <div className="blog-post-meta m-0 d-flex justify-content-between align-items-center flex-wrap">
          <span>Published on {props.news? formatDate(new Date(props.news.createdOn)):""}</span>
          <span>{props.news && props.news.dateUpdated? `Last updated on ${formatDate(new Date(props.news.dateUpdated))}`:""}</span>
        <div className='d-flex justify-content-between align-items-center gap-3'>
          <Link href={`https://wa.me/?text=${process.env.NEXT_PUBLIC_DOMAIN}/${props.news?.slug}`} target='_blank' style={{color:"#00E676"}}><i className="bi bi-whatsapp fs-4"></i></Link>
          <Link href={`https://www.facebook.com/sharer.php?u=${process.env.NEXT_PUBLIC_DOMAIN}/${props.news?.slug}`} target='_blank' style={{color:"#1877F2"}}><i className="bi bi-facebook fs-4"></i></Link>
          <Link href={`https://twitter.com/intent/tweet?text=${process.env.NEXT_PUBLIC_DOMAIN}/${props.news?.slug}`} target='_blank' style={{color:"#1DA1F2"}}><i className="bi bi-twitter fs-4"></i></Link>
          <button type="button" style={{background:"none",border:"none",outline:"none",padding:"0px",color:"#712cf9"}} onClick={()=>{handleShare(props.news || {title:"",metadesc:"",slug:""})}}><i className="bi bi-share fs-4"></i></button>
        </div>
        </div>
          <span>{props.news? props.news.views:""} Views</span>
        <div className="d-flex justify-content-center mb-4">
        <img src={props.news?.topimage} alt="" style={{maxWidth:"100%"}}/>
        </div>
        <QuillEditor
              value={props.news?.content}
              readOnly={true}
              id="newsContent"
              modules={{ toolbar: false }}
              className="w-full h-[70%] mt-10 bg-white public-newsItemContent"
            />
        
      </article>

    </div>
  )
}

export default NewsItem