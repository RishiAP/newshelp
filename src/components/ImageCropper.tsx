"use client";
import axios from 'axios';
import React, { ReactEventHandler, useState } from 'react'
import ReactCrop, { Crop, PercentCrop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Admin } from './AdminDashboard';
import { toast } from 'react-toastify';

export const ImageCropper = (props:{src:null|string,crop:Crop,croppedImageUrl:null|Blob,onCropComplete:(crop: PixelCrop, percentageCrop: PercentCrop) => void,setCrop:React.Dispatch<React.SetStateAction<Crop>>,onImageLoaded:ReactEventHandler<HTMLImageElement>,setAuthor:React.Dispatch<React.SetStateAction<Admin>>}) => {
    const [isUploading, setIsUploading] = useState(false);
    async function blobToBase64(blob:Blob):Promise<string>{
        return new Promise((resolve,reject)=>{
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(blob);
        });
    }
    async function uploadAdminImage(){
      setIsUploading(true);
        axios.put('/api/author_profile', {base64Image:await blobToBase64(props.croppedImageUrl as Blob)})
        .then(res => {
          props.setAuthor(res.data);
          (document.getElementById("profileImageSettingModal")?.querySelector(".btn-close") as HTMLButtonElement)?.click();
          // Handle success response
          toast.success("Profile pic updated successfully",{position:"top-center",theme: document.querySelector("html")?.getAttribute("data-theme") as "light"|"dark"});
        })
        .catch(error => {
          console.error('Error during upload:', error);
          // Handle error
        }).finally(()=>{
          setIsUploading(false);
        });
    }
  return (
    <>
    <button type="button" className="d-none" id="profileImageSettingModalTriggerButton" data-bs-toggle="modal" data-bs-target="#profileImageSettingModal"></button>
    <div className="modal fade" id="profileImageSettingModal" tabIndex={-1} aria-labelledby="profileImageSettingModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="profileImageSettingModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body d-flex justify-content-center align-items-center">
      {props.src && (
        <ReactCrop
          crop={props.crop}
          ruleOfThirds
          onComplete={props.onCropComplete}
          onChange={(crop:Crop) => props.setCrop(crop)}
          aspect={1}
          keepSelection={true}
          minHeight={200}
          minWidth={200}
          maxHeight={400}
          maxWidth={400}
          circularCrop={true}
        >
            <img src={props.src} id="mainCroppingImage" onLoad={props.onImageLoaded} alt="" style={{maxHeight:"calc(100vh - 250px)"}} />
        </ReactCrop>
      )}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
        <button type="button" className="btn btn-success d-flex gap-2 align-items-center justify-content-center" onClick={uploadAdminImage} disabled={isUploading}>
          <span className={`spinner-border spinner-border-sm ${isUploading?"":"d-none"}`} aria-hidden="true"></span>
          <span role="status">{isUploading?"Setting Image....":"Set Image"}</span>
        </button>
      </div>
    </div>
  </div>
</div>
    </>
  )
}
