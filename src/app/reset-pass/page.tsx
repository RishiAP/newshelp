"use client";
import ThemeChanger from '@/components/ThemeChanger';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
type formDataType = {
  email:string,
  password:string,
  cpassword:string,
}
const Page = () => {
  const [formData, setFormData] = useState<formDataType>({email:"",password:"",cpassword:""});
  const [shouldReset, setShouldReset] = useState(false);
  async function submitSignup(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    let p;
    let t:any;
    if(shouldReset){
      t=toast.loading("Resetting...");
      axios.post('/api/reset-pass',{...formData,token:window.location.href.split('token=')[1]}).then((res)=>{
        toast.update(t,{render:"Password changed successfully",type:"success",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
        window.location.href="/admin-login";
      }).catch((err:any)=>{
        toast.update(t,{render:err.response.data.message,type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
      });
    }
    else{
      p=axios.post('/api/forget-pass',{email:formData.email});
      t=toast.loading("Sending verification email...");
        p.then((res)=>{
          console.log(res.data);
          toast.update(t,{render:"Please check the email sent to reset password",type:"success",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
        }).catch((err)=>{
          if(err.response.status==404)
          toast.update(t,{render:err.response.data.message,type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
        else
        toast.update(t,{render:"Something went wrong",type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
          console.log(err.response.data);
        });
    }
  }
  useEffect(()=>{
    if(window.location.href.includes('token')){
      setShouldReset(true);
    }
  },[]);
  return (
    <main className='form-signin w-100 m-auto h-100 d-flex align-items-center'>
    <form onSubmit={submitSignup} className='w-100'>
    <h1 className='text-center d-flex align-item-center justify-content-center'>News<i className='bi bi-fire' style={{color:"#ff6142"}}></i>Help</h1>
    <h2 className="h3 mb-3 fw-normal text-center">Password Reset</h2>
    <div className="input-cover-div">
    <div className="form-floating">
      <input type="email" className="form-control" id="email" placeholder="name@example.com" onInput={
        (e:React.ChangeEvent<HTMLInputElement>)=>{
          setFormData({...formData,email:e.target.value})
        }
      } required style={shouldReset? {}:{borderRadius:"var(--bs-border-radius)",marginBottom:"1rem"}}  />
      <label htmlFor="email">Email address</label>
    </div>
    </div>
    <div className={`${!shouldReset? "d-none ":""}input-cover-div`}>
    <div className="form-floating">
      <input type="password" className="form-control" id="password" placeholder="Password" onInput={
        (e:React.ChangeEvent<HTMLInputElement>)=>{
          setFormData({...formData,password:e.target.value})
        }
      } required={shouldReset} />
      <label htmlFor="password">Password</label>
    </div>
    </div>
    <div className={`${!shouldReset? "d-none ":""}input-cover-div`}>
    <div className="form-floating">
      <input type="password" className="form-control" id="cpassword" placeholder="Password" onInput={
        (e:React.ChangeEvent<HTMLInputElement>)=>{
          setFormData({...formData,cpassword:e.target.value})
        }
      } required={shouldReset} />
      <label htmlFor="cpassword">Confirm Password</label>
    </div>
    </div>
    <button className="btn btn-primary w-100 py-2 mb-3" type="submit">Reset Password</button>
    <Link href="/admin-login">Login</Link>
    <p className="mt-5 mb-3 text-body-secondary">NewsHelp | © 2024-2025</p>
  </form>
  <ToastContainer theme="dark" draggablePercent={60} position="top-center" draggable />
  <ThemeChanger/>
    </main>
  )
}

export default Page