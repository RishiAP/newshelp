"use client";
import axios from 'axios';
import React, {useState,useEffect} from 'react'
import NewsCard from './NewsCard';
import ContentLoadSpinner from './ContentLoadSpinner';
import { Article } from '@/app/categories/[category]/page';

export default function SearchModal(){
    const [searchTerm, setSearchTerm] = useState('');
    const [searchAlertMessage, setSearchAlertMessage] = useState('');
    const [loadingTop, setLoadingTop] = useState(false);
    const [loadingBottom, setLoadingBottom] = useState(false);
    const [shouldScrollFetch, setShouldScrollFetch] = useState(true);
    const [searchArticles, setSearchArticles] = useState<Article[]>([]);
  function closeSearchModal(){
    const closeButton:(HTMLButtonElement | null | undefined)=document.getElementById("searchModal")?.querySelector(".btn-close");
    closeButton?.click();
  }
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(searchTerm)
      if(searchTerm!=""){
        axios.get(`/api/search_articles?query=${searchTerm}&datetime=NONE`).then((res)=>{
          console.log(res.data);
          setSearchArticles(res.data);
          if(res.data.length==0){
            setSearchAlertMessage("No articles found");
          }
          setLoadingTop(false);
          document.getElementById("searchedArticles")?.classList.remove("d-none");
        }).catch(err=>console.log(err));
      }
      else{
        setLoadingTop(false);
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

const onClickSearchArticle=()=>{closeSearchModal(); const mainWin=document.getElementById('mainWindowDiv');
mainWin?.querySelector('#articles')?.classList.add('d-none');
mainWin?.querySelector('.alert')?.classList.add('d-none');
mainWin?.querySelector('.content-load-spinner')?.classList.remove('d-none');
mainWin?.querySelector('.content-load-spinner')?.classList.add('d-flex');

};

  function handleSearchScroll(e:React.UIEvent<HTMLDivElement>){
    const element=(e.target as HTMLDivElement);
    if(shouldScrollFetch && element.scrollHeight-element.scrollTop-element.clientHeight<30){
      setShouldScrollFetch(false);
      setLoadingBottom(true);
      axios.get(`/api/search_articles?query=${searchTerm}&datetime=${encodeURIComponent(searchArticles[searchArticles.length-1]?.date || "NONE")}`).then((res)=>{
        setSearchArticles([...searchArticles,...res.data]);
        document.getElementById("searchedArticles")?.classList.remove("d-none");
        if(res.data.length<4){
          setShouldScrollFetch(false);
          setSearchAlertMessage("No more articles found");
        }
        else setShouldScrollFetch(true);
        setLoadingBottom(false);
      }).catch(err=>console.log(err));
    }
  }

  return (
    <div className="modal fade" id="searchModal" tabIndex={-1} aria-labelledby="searchModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-xl modal-dialog-scrollable modal-fullscreen-md-down">
    <div className="modal-content">
      <div className="modal-header">
        <input type="search" name="mainSearchInput" id="mainSearchInput" className="form-control form-control-lg" placeholder='Search' onInput={(e:React.ChangeEvent<HTMLInputElement>)=>{setSearchTerm(e.currentTarget.value); document.getElementById("searchedArticles")?.classList.add("d-none"); setLoadingBottom(false); 
        setShouldScrollFetch(true);
        setSearchAlertMessage("");
        if(e.currentTarget.value==""){
          setLoadingTop(false);
          }
          else setLoadingTop(true)}} />
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" style={{marginLeft:"1rem"}}></button>
      </div>
      <div className="modal-body" style={{minHeight:"100px"}} onScroll={handleSearchScroll}>
        <ContentLoadSpinner loading={loadingTop} classProperties={"w-100 mb-3"}/>
        <div id="searchedArticles">
        {
          searchArticles.map((article:any)=>{
            return (
              <NewsCard key={article._id} article={article} onClick={onClickSearchArticle} />
            )
          })
        }
        </div>
        <div className={`${searchAlertMessage==""? "d-none":""} alert alert-primary text-center`} role="alert">
  {searchAlertMessage}
</div>
        <ContentLoadSpinner loading={loadingBottom} classProperties={"w-100"}/>
      </div>
    </div>
  </div>
</div>
  )
}