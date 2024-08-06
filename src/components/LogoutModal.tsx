"use client";
import axios from 'axios';
import React from 'react'
import { toast } from 'react-toastify';

export const LogoutModal = () => {
    function logout(){
        const toastId=toast.loading("Logging out... 🕒");
        axios.post("/api/logout").then((res)=>{
            toast.update(toastId,{render:"Logged out successfully",type:"success",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
            setTimeout(()=>{
                window.location.href="/admin-login";
            },1000);
        }).catch((err)=>{
            toast.update(toastId,{render:"Oops! Something went wrong. 🤯",type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
            console.log(err);
        });
    }
  return (
    <>
    <div className="modal fade" id="logoutModal" tabIndex={-1} aria-labelledby="logoutModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="logoutModalLabel">Are you sure you want to logout?</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body d-flex flex-column gap-3">
        <button type="button" className='btn btn-outline-danger btn-lg w-100' onClick={logout}>Logout</button>
        <button type="button" className="btn btn-success btn-lg w-100" data-bs-dismiss="modal">Cancel</button>
      </div>
    </div>
  </div>
</div>
    </>
  )
}
