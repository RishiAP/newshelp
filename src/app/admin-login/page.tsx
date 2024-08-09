"use client";
import ThemeChanger from '@/components/ThemeChanger';
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
  async function submitSignup(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    let t:any;
      t=toast.loading("Logging in...");
      axios.post('/api/admin-login',formData).then((res)=>{
        toast.update(t,{render:res.data.message,type:"success",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
        setTimeout(()=>{
          window.location.href="/admin";
        },1000);
      }).catch((err:any)=>{
        toast.update(t,{render:err.response.data.message,type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
      });
  }

  return (
    <main className='form-signin w-100 m-auto h-100 d-flex align-items-center'>
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
    <button className="btn btn-primary w-100 py-2 mt-3" type="submit">Login</button>
    <div className="d-flex justify-content-between mt-3">
    <Link href="/reset-pass">Reset Password</Link>
    <Link href="/admin-signup">Signup</Link>
    </div>
    <p className="mt-5 mb-3 text-body-secondary">NewsHelp | © 2024-2025</p>
  </form>
  <ToastContainer theme="dark" draggablePercent={60} position="top-center" draggable />
  <ThemeChanger/>
    </main>
  )
}

export default Page