import axios from 'axios';
import React from 'react'
import { Admin } from './AdminDashboard';

export const ImageHandleModal = (props:{setAuthor:React.Dispatch<React.SetStateAction<Admin>>}) => {
    function removeProfilePic() {
        axios.delete("/api/author_profile").then((res)=>{
            props.setAuthor(res.data);
        }).catch((err)=>{
            console.log(err);
        });
    }
    function changeProfilePic(e:React.MouseEvent<HTMLButtonElement>) {
        (e.currentTarget.parentElement?.parentElement?.querySelector(".btn-close") as HTMLButtonElement)?.click();
        setTimeout(() => {
            document.getElementById("adminImageInput")?.click();
        },300);
    }
  return (
    <div className="modal fade" id="imageHandleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body d-flex flex-column gap-3">
        <button type="button" className="btn btn-outline-danger btn-lg" onClick={removeProfilePic}>Remove Profile pic</button>
        <button type="button" className="btn btn-success btn-lg" onClick={changeProfilePic}>Change Profile Pic</button>
        <button type="button" className="btn btn-secondary btn-lg"  data-bs-dismiss="modal">Cancel</button>
      </div>
    </div>
  </div>
</div>
  )
}
