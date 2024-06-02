"use client";
import React, { ChangeEvent, FormEventHandler, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import AdminNavbar from "@/components/AdminNavbar";
import CreateCategoryModal from "@/components/CreateCategoryModal";
import axios from "axios";
import Image from "next/image";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

export default function Home() {
  const [formData, setFormData] = useState({title:"",topimage:"",category:"",content:{}});
  const [categories, setCategories] = useState([]);
  useEffect(()=>{
    async function getCategories(){
      setCategories((await axios.get('/api/category')).data);
    }
    getCategories();
  }, [])
  

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"],
    ],
  };

  const handleTitleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData,title:e.currentTarget.value});
  };
  const handleCategoryChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({...formData,category:e.currentTarget.value});
  };
  const handleTopImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.currentTarget.files!=null){
        var reader = new FileReader();
        reader.readAsDataURL(e.currentTarget.files[0]);
        reader.onload = function () {
          setFormData({...formData,topimage:reader.result?reader.result.toString():""});
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
    }
  };
  const handleEditorChange = (content:any, delta:any, source:any, editor:any) => {
    setFormData({...formData,content:editor.getContents()});
    console.log(editor.getContents());
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetch('/api/add_news',{
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(formData)
    })
    .then(async response =>{
      console.log(await response.json());
    })
  };

  return (
    <>
    <AdminNavbar/>
    <CreateCategoryModal setCategories={setCategories} categories={categories}/>
    <main className="h-100">
      <div className="container h-100">
        <h1>Create a new News Post</h1>
        <form className="d-flex flex-column" onSubmit={handleSubmit}>
          <label htmlFor="newsTitle" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control mb-3"
            id="newsTitle"
            onChange={handleTitleChange}
            placeholder="Enter title of the news"
            required
          />
          <label htmlFor="categorySelect" className="form-label">Category</label>
          <select className="form-select mb-3" id="categorySelect" aria-label="Default select example" onChange={handleCategoryChange} defaultValue={0} required>
  <option value={0} disabled>Select Category</option>
  {
    categories.map((category:any) => {
      return <option key={category._id} value={category.value}>{category.value}</option>
    })
  }
</select>
<div className="mb-3">
  <label htmlFor="formFile" className="form-label">Top Image</label>
  <input className="form-control" type="file" id="formFile" accept="image/*" required onInput={handleTopImage}/>
</div>
<div className="d-flex justify-content-center w-100">
{
  formData.topimage===""?null:<Image src={formData.topimage} width={0}
  height={0}
  sizes="100vw"
  style={{ maxWidth: '100%', width:"auto", height: 'auto' }} alt=""/>
}
</div>
          <label htmlFor="newsContent" className="form-label">
            Content
          </label>
          <div className="">
            <QuillEditor
              value={formData.content}
              onChange={handleEditorChange}
              modules={quillModules}
              id="newsContent"
              className="w-full h-[70%] mt-10 bg-white"
            />
          </div>
          <button type="submit" className="btn btn-success btn-lg mt-3">Publish</button>
        </form>
      <button type="button" className="btn btn-link mt-3" data-bs-toggle="modal" data-bs-target="#createCategoryModal">Create a new category</button>
      </div>
    </main>
    </>
  );
}
