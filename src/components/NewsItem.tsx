"use client";
import React, { useEffect } from 'react';
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Image from 'next/image';

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

const NewsItem = (props:{news:{title:string,content:Object,category:string,date:string,topimage:string,metadesc:string},newsExist:boolean}) => {
  console.log(props.news)
  
  return (
    <div>
      <article className="blog-post position-relative">
        <h2 className="display-5 link-body-emphasis mb-1">{props.news.title}</h2>
        <p className="blog-post-meta">{(new Date(props.news.date)).toString()}<a href="#">Mark</a></p>
        <div className="d-flex justify-content-center mb-4">
        <img src={props.news.topimage} alt="" style={{maxWidth:"100%"}}/>
        </div>
        <QuillEditor
              value={props.news.content}
              readOnly={true}
              id="newsContent"
              modules={{ toolbar: false }}
              className="w-full h-[70%] mt-10 bg-white"
            />
        
      </article>

    </div>
  )
}

export default NewsItem