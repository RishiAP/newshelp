"use client";
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { timeAgo } from './NewsItem';
import Image from 'next/image';
import { Article_without_content } from '@/app/page';
export type Author_Details = {
    name:string,
    profilePic:string|null,
    bio:string|null,
    socialLinks:{instagram:string|null,twitter:string|null,facebook:string|null}|null,
    createdOn:string|Date
}
const SideElement = (props:{author?:Author_Details,setLoading?:React.Dispatch<React.SetStateAction<boolean>>,showRecents:boolean}) => {
  const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  useEffect(() => {
    console.log(props.author);
  },[]);
  function getYearsAndMonths(startDate:string, endDate = new Date()):{year:number,month:number}[] {
    const result = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    let currentYear = start.getFullYear();
    let currentMonth = start.getMonth(); // 0 = January, 11 = December
  
    while (currentYear < end.getFullYear() || (currentYear === end.getFullYear() && currentMonth <= end.getMonth())) {
      result.push({ year: currentYear, month: currentMonth + 1 }); // month + 1 for 1-indexed month
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
  
    return result.reverse();
  }
  
  const loadLoader=()=>{
    if(props.setLoading)
      props.setLoading(true);
    else{
      document.getElementById("mainWindowDiv")?.querySelector(".content-load-spinner")?.classList.remove("d-none");
      document.getElementById("mainWindowDiv")?.querySelector(".content-load-spinner")?.classList.add("d-flex");
    }
  }
  const [sideArticles, setSideArticles] = useState<Article_without_content[]>([]);
  useEffect(()=>{
    if(props.showRecents){
      axios.get(`/api/get_articles?type=recent&slug_present=${window.location.href.split("/")[3]}`).then((res) => {
        setSideArticles(res.data);
        console.log(res.data);
      }).catch((err)=>{
        console.log(err);
      });
    }
  },[])

  return (
    <div className={`col-md-${props.author!=undefined? "4":"2"}`}>
      <div className="position-sticky" style={{top:"2rem"}}>
        <div className={`${props.showRecents && props.author?"":"d-none "}p-4 mb-3 bg-body-tertiary rounded`}>
          <div className="d-flex flex-column align-items-center">
            <div className="mb-3 d-flex justify-content-center slign-item-center">
            {
              props.author?.profilePic!=null?<img src={props.author?.profilePic} alt="" className="rounded-circle" style={{width:"150px",height:"150px"}} />:<i className="bi bi-person-circle" style={{fontSize:"7rem"}}></i>
            }
            </div>
          <p className='fs-5 mb-0'>{props.author?.name}</p>
          <p className='fs-6'>{props.author?.bio}</p>
          <div className='d-flex gap-3'>
            {
              props.author?.socialLinks?.instagram && <a href={`https://instagram.com/${props.author.socialLinks.instagram}`} target="_blank" rel="noreferrer"><i className="bi bi-instagram fs-5 instagram-icon-colored"></i></a>
            }
            {
              props.author?.socialLinks?.twitter && <a href={`https://twitter.com/${props.author.socialLinks.twitter}`} target="_blank" rel="noreferrer"><i className="bi bi-twitter fs-5 twitter-icon-colored"></i></a>
            }
            {
              props.author?.socialLinks?.facebook && <a href={`https://facebook.com/${props.author.socialLinks.facebook}`} target="_blank" rel="noreferrer"><i className="bi bi-facebook fs-5 facebook-icon-colored"></i></a>
            }
          </div>
          </div>
        </div>

        <div className={props.showRecents?"":"d-none"}>
          <h4 className="fst-italic">Recent posts</h4>
          <ul className="list-unstyled">
            {
              sideArticles.map((article:Article_without_content) => {
                return <li key={article.slug}>
                <Link className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top" href={`/${article.slug}`} onClick={loadLoader} >
                <Image src={article.topimage} alt={article.title} width={100} height={100} style={{height:"auto",width:"100%"}} className="rounded" />
                  <div className="col-lg-8">
                    <h6 className="mb-0">{article.title}</h6>
                    <small className="text-body-secondary">{timeAgo(article.createdOn)}</small>
                  </div>
                </Link>
              </li>
              })
            }
          </ul>
        </div>

        <div className="p-4">
          <h4 className="fst-italic">Archives</h4>
          <ol className="list-unstyled mb-0">
            {
              getYearsAndMonths("2024-05-01").map((yearMonth:{year:number,month:number})=>{
                return <li key={yearMonth.year+yearMonth.month}><Link href={`/archives/${yearMonth.year}/${months[yearMonth.month-1]}`} onClick={loadLoader}>{months[yearMonth.month-1]+" "+yearMonth.year}</Link></li>
              }
              )
            }
          </ol>
        </div>

        <div className={`${props.showRecents?"d-none ":""}p-4`}>
          <h4 className="fst-italic">Elsewhere</h4>
          <ol className="list-unstyled">
            <li><a href="#">GitHub</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Facebook</a></li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default SideElement