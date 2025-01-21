"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Admin } from './AdminDashboard';
import { toast } from 'react-toastify';

export const ImageHandleModal = (props:{author:Admin,setAuthor:React.Dispatch<React.SetStateAction<Admin>>}) => {
  const [removing, setRemoving] = React.useState(false);
  const [removeOptionDisplay, setRemoveOptionDisplay] = useState(false);
    function removeProfilePic() {
      setRemoving(true);
        axios.delete("/api/author_profile").then((res)=>{
            props.setAuthor(res.data);
            (document.querySelector("#imageHandleModal .btn-close") as HTMLButtonElement).click();
            toast.success("Profile pic removed successfully",{position:"top-center",theme: document.querySelector("html")?.getAttribute("data-theme") as "light"|"dark"});
        }).catch((err)=>{
            console.log(err);
        }).finally(()=>{
            setRemoving(false);
        });
    }
    function changeProfilePic(e:React.MouseEvent<HTMLButtonElement>) {
      (document.querySelector("#imageHandleModal .btn-close") as HTMLButtonElement).click();
      document.getElementById("adminImageInput")?.click();
    }
    useEffect(()=>{
        document.querySelector("#imageHandleModal")?.addEventListener("hidden.bs.modal",()=>{
            setRemoveOptionDisplay(false);
        });
    },[]);
  return (
    <div className="modal fade" id="imageHandleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">{removeOptionDisplay?"Are you sure you want to remove the profile pic?":"Image Options"}</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body d-flex flex-column gap-3">
        {
          !removeOptionDisplay?
        <><button type="button" className={`btn btn-outline-danger btn-lg ${props.author.profilePic? "":"d-none"}`} onClick={()=>{setRemoveOptionDisplay(true);}}>Remove Profile pic</button>
        <button type="button" className="btn btn-success btn-lg" onClick={changeProfilePic}>Change Profile Pic</button>
        <button type="button" className="btn btn-secondary btn-lg"  data-bs-dismiss="modal">Cancel</button></>:
        <>
        <button type="button" className="btn btn-outline-danger btn-lg d-flex gap-2 align-items-center justify-content-center" onClick={removeProfilePic} disabled={removing}>
        <span className={`spinner-border spinner-border-lg ${removing?"":"d-none"}`} aria-hidden="true"></span>
        <span role="status">{removing?"Removing...":"Remove"}</span>
        </button>
        <button type="button" className="btn btn-success btn-lg" onClick={()=>{setRemoveOptionDisplay(false)}}>Cancel</button>
        </>
        }
      </div>
    </div>
  </div>
</div>
  )
}
