"use client";
import axios from 'axios';
import React, { FormEvent, useEffect, useState } from 'react'
import { Admin } from './AdminDashboard';
import { toast } from 'react-toastify';

export const AuthorUpdateModal = (props:{author:Admin,setAuthor:React.Dispatch<React.SetStateAction<Admin>>}) => {
    const [formData, setFormData] = useState<Admin>(props.author);
    const [loader, setLoader] = useState(false);
    function updateAuthorDetails(e:FormEvent<HTMLFormElement>){
        e.preventDefault();
        setLoader(true);
        axios.post("/api/author_profile",formData).then((res)=>{
            props.setAuthor(res.data.author);
            const authorUpdateModal=document.getElementById("authorUpdateModal");
            authorUpdateModal?.querySelector("form")?.reset();
            (authorUpdateModal?.querySelector("button[data-bs-dismiss='modal']") as HTMLButtonElement)?.click();
            toast.success("Details updated successfully",{position:"top-center",theme: document.querySelector("html")?.getAttribute("data-theme") as "light"|"dark"});
        }).catch((err)=>{
            console.log(err);
        }).finally(()=>{
            setLoader(false);
        });
    }
    useEffect(()=>{
      setFormData(props.author);
    },[props.author]);
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
            <input type="text" className="form-control" id="authorName" value={formData.name} onInput={(e)=>{setFormData({...formData,name:e.currentTarget.value});}} required />
          </div>
          <div className="mb-3">
            <label htmlFor="authorBio" className="form-label">Bio</label>
            <textarea className="form-control" id="authorBio" value={formData.bio||""} onInput={(e)=>{setFormData({...formData,bio:e.currentTarget.value});}} rows={3}></textarea>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" style={{paddingBottom:"0.7rem"}}><i className="bi bi-instagram"></i></span>
            <input type="text" className="form-control" id="instagram_usn" value={formData.socialLinks?.instagram||""} onInput={(e)=>{
              setFormData({
                ...formData,
                socialLinks: formData.socialLinks
                  ? { ...formData.socialLinks, instagram: e.currentTarget.value }
                  : { instagram: e.currentTarget.value, twitter: null, facebook: null }
              });
              }} placeholder="Username" aria-label="Username" aria-describedby="instagram_usn"/>
        </div>
          <div className="input-group mb-3">
            <span className="input-group-text" style={{paddingBottom:"0.7rem"}}><i className="bi bi-twitter"></i></span>
            <input type="text" className="form-control" id="twitter_usn" value={formData.socialLinks?.twitter||""} onInput={(e)=>{
              setFormData({
                ...formData,
                socialLinks: formData.socialLinks
                  ? { ...formData.socialLinks, twitter: e.currentTarget.value }
                  : { instagram: null, twitter: e.currentTarget.value, facebook: null }
              });
              }} placeholder="Username" aria-label="Username" aria-describedby="twitter_usn"/>
        </div>
          <div className="input-group mb-3">
            <span className="input-group-text" style={{paddingBottom:"0.7rem"}}><i className="bi bi-facebook"></i></span>
            <input type="text" className="form-control" id="facebook_usn" value={formData.socialLinks?.facebook||""} onInput={(e)=>{
              setFormData({
                ...formData,
                socialLinks: formData.socialLinks
                  ? { ...formData.socialLinks, facebook: e.currentTarget.value }
                  : { instagram: null, twitter: null, facebook: e.currentTarget.value }
              });
            }} placeholder="Username" aria-label="Username" aria-describedby="facebook_usn"/>
        </div>
      <div className="modal-footer" style={{paddingBottom:"0",paddingRight:"0"}}>
        <button type="button" className="btn btn-success" data-bs-dismiss="modal">Cancel</button>
        <button className="btn btn-danger d-flex gap-2 justify-content-center align-items-center" type="submit" disabled={loader}>
          <span className={`spinner-border spinner-border-sm ${loader? "":"d-none"}`} aria-hidden="true"></span>
          <span role="status">{loader?"Saving...":"Save Changes"}</span>
        </button>
      </div>
        </form>
      </div>
    </div>
  </div>
</div>
  )
}
