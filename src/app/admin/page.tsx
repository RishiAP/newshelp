"use client";
import React, { useState, useEffect, ReactElement, FormEvent } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import NewsCRUDComponent from "@/components/NewsCRUDComponent";
import axios, { AxiosPromise } from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ContentLoadSpinner from "@/components/ContentLoadSpinner";
import Link from "next/link";

export type NewsContent = {
  title: string,
  topimage: string,
  category: string | { _id: Object; value: string },
  content: Object,
  slug: string,
};

export default function Home() {
  const [formData, setFormData] = useState<NewsContent>({
    title: "",
    topimage: "",
    category: "",
    content: {},
    slug: "",
  });
  const [actionType, setActionType] = useState("create");
  const [newsSlug, setNewsSlug] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      title: "",
      topimage: "",
      category: "",
      content: {},
      slug: "",
    });
    if (actionType === "create") {
      setShowEditor(true);
    }
    else{
      setShowEditor(false);
    }
    toast.dismiss();
  }, [actionType]);

  const handlePublish = (e: FormEvent) => {
    e.preventDefault();
    e.currentTarget.querySelector('fieldset')?.setAttribute("disabled","true");
    toast.dismiss();
    const toastId=toast.loading("Publishing article... 🕒");
    axios.post("/api/edit_news", formData).then((res) => {
      if(res.status==200)
      toast.update(toastId,{render:<>Article published successfully! 🎉 <Link href={`/${res.data.slug}`} target="_blank" rel="noreferrer">View Article</Link></>,type:"success",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
    }).catch((err) => {
      if(err.response.data.error.code==11000){
        toast.update(toastId,{render:"Article with same title already exists! ☹️",type:"warning",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
      }
      else{
        toast.update(toastId,{render:"Oops! Something went wrong. 🤯",type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
      }
      console.log(err);
    }).finally(function (){
      document.getElementById("articleControlForm")?.querySelector('fieldset')?.removeAttribute("disabled");
      });
      
  };
  const handleUpdate =async (e: FormEvent) => {
    e.preventDefault();
    e.currentTarget.querySelector('fieldset')?.setAttribute("disabled","true");
    toast.dismiss();
    const toastId=toast.loading("Updating article... 🕒");
    axios.put(`/api/edit_news?slug=${newsSlug}`, formData).then((res) => {
      if(res.status==200)
        toast.update(toastId,{render:<>Article updated successfully! 🎉 <Link href={`/${res.data.slug}`} target="_blank" rel="noreferrer">View Article</Link></>,type:"success",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
    }).catch((err) => {
      toast.update(toastId,{render:"Oops! Something went wrong. 🤯",type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
      console.log(err);
      }).finally(function (){
        document.getElementById("articleControlForm")?.querySelector('fieldset')?.removeAttribute("disabled");
    });

  };
  const handleDelete = (e: any) => {
    e.preventDefault();
    toast.dismiss();
    const deletePromise=axios.delete(`/api/edit_news?slug=${newsSlug}`);
    asyncToast(deletePromise,"Deleting article... 🕒","Article deleted successfully! 🎉","Oops! Something went wrong. 🤯");
    deletePromise.then((res) => {
      if(res.data.slug===formData.slug){
        setFormData({
          title: "",
          topimage: "",
          category: "",
          content: {},
          slug: ""
        });
        showEditor && setShowEditor(false);
        const articleURL:any=document.getElementById("articleURL");
        articleURL.value="";
      }
    }).catch((err) => {
      console.log(err);
    });

  };

  useEffect(() => {
    const delayDebounceFn=setTimeout(() => {
      if(newsSlug=="") return;
      axios
      .get(`/api/edit_news?slug=${newsSlug}`)
      .then((res) => {
        console.log(res.data);
        if(res.data!=null){
          const fetchedData = res.data;
          fetchedData.category = fetchedData.category.value;
          setFormData(fetchedData);
          setShowEditor(true);
        }
        else{
          displayMsg("error","Article not found!",undefined,3000);
        }
        setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    },1000);
    return () => clearTimeout(delayDebounceFn);
  },[newsSlug]);

  const displayMsg=(type:string,msg:string,toastId:undefined|string=undefined,autoClose:number|false=5000)=>{
    switch(type){
      case "success":
        toast.success(msg,{position: "top-center",autoClose,toastId});
        break;
      case "error":
        toast.error(msg,{position: "top-center",autoClose,toastId});
        break;
      default:
        toast(msg,{position: "top-center",autoClose,toastId});
    }
  }

  const asyncToast=(p:AxiosPromise,pending:string|ReactElement,success:string|ReactElement,error:string|ReactElement)=>{
    toast.promise(
      p,
      {
        pending: {
          render: <>
            <p className="m-0 text-center">{pending}</p>
          </>
        },
        success: {
          render: <>
            <p className="m-0 text-center">{success}</p>
            
          </>,
        },
        error:{
          render:<>
            <p className="m-0 text-center">{error}</p>
          </>
        }
      },
      {
        autoClose: false,
        position: "top-center"
      }
      );
  }

  return (
    <>
      <AdminNavbar actionType={actionType} setActionType={setActionType} />
      <main className="h-100">
        <div className="container h-100">
          <h1>
            {actionType === "create"
              ? "Create a News Post"
              : actionType === "update"
              ? "Update an Article"
              : "Delete an Article"}
          </h1>
          {actionType != "create" && (
            <div>
              <label htmlFor="newsTitle" className="form-label">
                News URL
              </label>
              <input
                type="text"
                className="form-control mb-3"
                id="articleURL"
                onInput={(e)=>{
                  setNewsSlug(e.currentTarget.value.split("/")[3]);
                  showEditor && setShowEditor(false);
                  setLoading(true);
                }}
                placeholder="Enter news URL"
                required
              />
            </div>
          )}
          {
            <ContentLoadSpinner loading={loading} classProperties="w-100" />
          }
          {showEditor && (
            <NewsCRUDComponent
              type={actionType}
              handleSubmit={actionType === "create" ? handlePublish : actionType === "update" ? handleUpdate : handleDelete}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
        <ToastContainer theme="dark" draggablePercent={60} position="top-center" draggable />
      </main>
    </>
  )
}
