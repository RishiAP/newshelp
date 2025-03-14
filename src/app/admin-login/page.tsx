"use client";
import ThemeChanger from '@/components/ThemeChanger';
import GoogleIcon from '@/components/ui/google-icon';
import { signInWithGoogle } from '@/helpers/signin';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
type formDataType = {
  email:string,
  password:string
}
const Page = () => {
  const [formData, setFormData] = useState<formDataType>({email:"",password:""});
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  async function submitSignup(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setIsLoggingIn(true);
    let t:any;
      axios.post('/api/admin-login',formData).then((res)=>{
        toast.dismiss();
        toast.success(res.data.message,{isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
        setTimeout(()=>{
          window.location.href="/admin";
        },1000);
      }).catch((err:any)=>{
        toast.dismiss();
        toast.error(err.response.data.message,{isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
      }).finally(()=>{
        setIsLoggingIn(false);
      });
  }

  return (
    <main className='form-signin w-100 m-auto h-auto d-flex align-items-center'>
    <form onSubmit={submitSignup} className='w-100'>
      <h1 className='text-center d-flex align-item-center justify-content-center'>News<i className='bi bi-fire' style={{color:"#ff6142"}}></i>Help</h1>
    <h2 className="h3 mb-3 fw-normal text-center">Please Login</h2>
    <div className="input-cover-div">
    <div className="form-floating">
      <input type="email" className="form-control" id="email" placeholder="name@example.com" onInput={
        (e:React.ChangeEvent<HTMLInputElement>)=>{
          setFormData({...formData,email:e.target.value});
        }
      } required />
      <label htmlFor="email">Email address</label>
    </div>
    </div>
    <div className="input-cover-div">
    <div className="form-floating">
      <input type="password" className="form-control" id="password" placeholder="Password" style={{borderBottomLeftRadius:"var(--bs-border-radius)",borderBottomRightRadius:"var(--bs-border-radius)"}} onInput={
        (e:React.ChangeEvent<HTMLInputElement>)=>{
          setFormData({...formData,password:e.target.value});
        }
      } required />
      <label htmlFor="password">Password</label>
    </div>
    </div>
    <button className="btn btn-primary w-100 py-2 mt-3 d-flex justify-content-center align-items-center gap-2" type="submit" disabled={isLoggingIn || isGoogleLoggingIn}>
      {
        isLoggingIn?<><span>Logging in...</span><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></>:"Login"
      }
    </button>
    <div className="d-flex justify-content-between mt-3">
    <Link href="/reset-pass">Reset Password</Link>
    <Link href="/admin-signup">Signup</Link>
    </div>
      <div className="position-relative d-flex justify-content-center mt-3 align-items-center">
        <span className="z-3 bg-body px-2">OR</span>
        <hr className='w-100 position-absolute z-2' />
      </div>
      <button type='button' className="btn btn-outline-primary btn-lg d-flex align-items-center m-auto gap-3 mt-3" onClick={async ()=>{
        setIsGoogleLoggingIn(true);
        signInWithGoogle().then((res)=>{
          if(res.status==200){
            toast.dismiss();
            toast.success(res.data.message,{autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
            setTimeout(()=>{
              window.location.href="/admin";
            },1000);
          }
        }
      ).catch((err)=>{
          toast.dismiss();
          if(err.response.status==404)
            toast.error("Sorry! Only registered emails are given admin controls.",{autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
          else
            toast.error("Oops! Something went wrong",{autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
          
        }).finally(()=>{
          setIsGoogleLoggingIn(false);
        });
      }} disabled={isLoggingIn || isGoogleLoggingIn}><GoogleIcon size={32}/>{isGoogleLoggingIn?<span className='d-flex align-items-center gap-1'>Logging In ...<span className="spinner-border" style={{width:"1.5rem",height:"1.5rem"}} role="status" aria-hidden="true"></span></span>:"Login with Google"}</button>
    <p className="mt-5 mb-3 text-body-secondary">NewsHelp | © 2024-2025</p>
  </form>
  <ToastContainer theme="dark" draggablePercent={60} position="top-center" draggable />
  <ThemeChanger/>
    </main>
  )
}

export default Page