"use client";
import axios from 'axios';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import SearchModal from './SearchModal';
export default function Navbar (props:{currentActive:string,setLoading?:React.Dispatch<React.SetStateAction<boolean>>}) {
  const [categories, setCategories] = useState<[]>([]);
  const loadLoader=()=>{
    if(props.setLoading)
      props.setLoading(true);
    else{
      const loader=document.getElementById("mainWindowDiv")?.querySelector(".content-load-spinner") || document.querySelector(".content-load-spinner.position-fixed");
      loader?.classList.remove("d-none");
      loader?.classList.add("d-flex");
    }
  }
  const navItemClick=(e:React.MouseEvent)=>{if(!e.currentTarget?.classList.contains("active")){loadLoader();}};
  useEffect(() => {
    axios.get('/api/category').then((res) => {
      setCategories(res.data);
    });
  },[]);
  useEffect(() => {
    document.getElementById("category_"+props.currentActive)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  },[categories]);
  return (
    <div className="container">
      <SearchModal/>
  <header className="border-bottom lh-1 py-3">
    <div className="row flex-nowrap justify-content-between align-items-center">
      <div className="col-4 pt-1">
      </div>
      <div className="col-4 text-center">
        <a className="blog-header-logo text-body-emphasis text-decoration-none" href="/" style={{color:"var(--bs-body-color) !important"}}>News <i className="bi bi-fire"></i> Help</a>
      </div>
      <div className="col-4 d-flex justify-content-end align-items-center">
        <button type="button" className="link-secondary" aria-label="Search" data-bs-toggle="modal" data-bs-target="#searchModal" style={{background:"none",border:"none",outline:"none"}} >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="mx-3" role="img" viewBox="0 0 24 24"><title>Search</title><circle cx="10.5" cy="10.5" r="7.5"></circle><path d="M21 21l-5.2-5.2"></path></svg>
        </button>
      </div>
    </div>
  </header>

  <div className="nav-scroller py-1 mb-3 border-bottom">
    <nav className="nav nav-underline justify-content-between">
    <Link key="category_headlines" id="category_headlines" className={"nav-item nav-link link-body-emphasis "+(props.currentActive==="headlines"? "active":"")} href={`/`} onClick={navItemClick}>Headlines</Link>
      {
        categories.map((category:any) => {
          return <Link key={category._id} id={`category_${category.value}`} className={"nav-item nav-link link-body-emphasis "+(category.value===props.currentActive? "active":"")} href={`/categories/${category.value}`} onClick={navItemClick}>{category.value}</Link>;
        })
      }
    </nav>
  </div>
</div>
  )
}