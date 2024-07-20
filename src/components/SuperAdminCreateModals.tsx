"use client";
import axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export const SuperAdminCreateModals = () => {
  const [newCategory,setNewCategory]=useState<string>('');
  const [newAuthor,setNewAuthor]=useState<string>('');
  function handleCreateCategory(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const toastId=toast.loading("Creating new category... 🕒");
    axios.post("/api/create-category",{value:newCategory}).then((res)=>{
      toast.update(toastId,{render:"Created new category successfully",type:"success",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
    }).catch((err)=>{
      console.log(err);
      if(err.response.data.error.code==11000)
      toast.update(toastId,{render:"Category already exists",type:"warning",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
    else{
      (document.getElementById("createCategoryModal")?.querySelector(".btn-close") as HTMLButtonElement)?.click();
      if(err.response.status==500)
      toast.update(toastId,{render:"Oops! Something went wrong. 🤯",type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
      else
      toast.update(toastId,{render:err.response.data.message,type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
    }
  }).finally(()=>{
    setNewCategory('');
  });
}
function handleCreateAuthor(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  const toastId=toast.loading("Creating new author... 🕒");
  axios.post("/api/create-author",{email:newAuthor}).then((res)=>{
    toast.update(toastId,{render:"Created new author successfully",type:"success",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
  }).catch((err)=>{
    console.log(err);
    if(err.response.data.error.code==11000)
    toast.update(toastId,{render:"Author already exists",type:"warning",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
  else{
    (document.getElementById("createAuthorModal")?.querySelector(".btn-close") as HTMLButtonElement)?.click();
    if(err.response.status==500)
    toast.update(toastId,{render:"Oops! Something went wrong. 🤯",type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
    else
    toast.update(toastId,{render:err.response.data.message,type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
  }
    }).finally(()=>{
      setNewAuthor('');
    });
  }
  return (
    <>
        <div className="modal fade" id="createCategoryModal" tabIndex={-1} aria-labelledby="createCategoryModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="createCategoryModalLabel">Create Category</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
        <form action="post" onSubmit={handleCreateCategory}>
      <div className="modal-body">
    <input type="text" name="newCategory" className='form-control' value={newCategory} id="newCategory" placeholder='Enter category name' required onInput={
      (e:React.ChangeEvent<HTMLInputElement>)=>{
        setNewCategory(e.currentTarget.value);
      }
    } />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-success" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" className="btn btn-danger">Create New Category</button>
      </div>
        </form>
    </div>
  </div>
</div>
<div className="modal fade" id="createAuthorModal" tabIndex={-1} aria-labelledby="createAuthorModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="createAuthorModalLabel">Create Author</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form action="post" onSubmit={handleCreateAuthor}>
      <div className="modal-body">
    <input type="email" name="newAuthor" className='form-control' id="newAuthor" value={newAuthor} placeholder='Enter author email' required onInput={
      (e:React.ChangeEvent<HTMLInputElement>)=>{
        setNewAuthor(e.currentTarget.value);
      }
    } />
      </div>
      <div className="modal-footer">
      <button type="button" className="btn btn-success" data-bs-dismiss="modal">Cancel</button>
      <button type="submit" className="btn btn-danger">Create New Author</button>
      </div>
      </form>
    </div>
  </div>
</div>
<ToastContainer theme="dark" draggablePercent={60} position="top-center" draggable />
    </>
  )
}
