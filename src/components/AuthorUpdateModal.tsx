"use client";
import axios from 'axios';
import React, { FormEvent, useState } from 'react'
import { Admin } from './AdminDashboard';

export const AuthorUpdateModal = (props:{setAuthor:React.Dispatch<React.SetStateAction<Admin>>}) => {
    const [formData, setFormData] = useState({name:"",bio:"",instagram:"",twitter:"",facebook:""});
    function updateAuthorDetails(e:FormEvent<HTMLFormElement>){
        e.preventDefault();
        axios.post("/api/author_profile",formData).then((res)=>{
            props.setAuthor(res.data.author);
            const authorUpdateModal=document.getElementById("authorUpdateModal");
            authorUpdateModal?.querySelector("form")?.reset();
            (authorUpdateModal?.querySelector("button[data-bs-dismiss='modal']") as HTMLButtonElement)?.click();
        }).catch((err)=>{
            console.log(err);
        });
    }
  return (
    <div className="modal fade" id="authorUpdateModal" tabIndex={-1} aria-labelledby="authorUpdateModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="authorUpdateModalLabel">Update your details</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form onSubmit={updateAuthorDetails}>
          <div className="mb-3">
            <label htmlFor="authorName" className="form-label">Name <span style={{color:"red"}}>*</span></label>
            <input type="text" className="form-control" id="authorName" onInput={(e)=>{setFormData({...formData,name:e.currentTarget.value});}} required />
          </div>
          <div className="mb-3">
            <label htmlFor="authorBio" className="form-label">Bio</label>
            <textarea className="form-control" id="authorBio" onInput={(e)=>{setFormData({...formData,bio:e.currentTarget.value});}} rows={3}></textarea>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" style={{paddingBottom:"0.7rem"}}><i className="bi bi-instagram"></i></span>
            <input type="text" className="form-control" id="instagram_usn" onInput={(e)=>{setFormData({...formData,instagram:e.currentTarget.value});}} placeholder="Username" aria-label="Username" aria-describedby="instagram_usn"/>
        </div>
          <div className="input-group mb-3">
            <span className="input-group-text" style={{paddingBottom:"0.7rem"}}><i className="bi bi-twitter"></i></span>
            <input type="text" className="form-control" id="twitter_usn" onInput={(e)=>{setFormData({...formData,twitter:e.currentTarget.value});}} placeholder="Username" aria-label="Username" aria-describedby="twitter_usn"/>
        </div>
          <div className="input-group mb-3">
            <span className="input-group-text" style={{paddingBottom:"0.7rem"}}><i className="bi bi-facebook"></i></span>
            <input type="text" className="form-control" id="facebook_usn" onInput={(e)=>{setFormData({...formData,facebook:e.currentTarget.value});}} placeholder="Username" aria-label="Username" aria-describedby="facebook_usn"/>
        </div>
      <div className="modal-footer" style={{paddingBottom:"0",paddingRight:"0"}}>
        <button type="button" className="btn btn-success" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" className="btn btn-danger">Save changes</button>
      </div>
        </form>
      </div>
    </div>
  </div>
</div>
  )
}
