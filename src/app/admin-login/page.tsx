"use client";
import axios from 'axios';
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
    <h1 className="h3 mb-3 fw-normal">Please Log In</h1>
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
      <input type="password" className="form-control" id="password" placeholder="Password" onInput={
        (e:React.ChangeEvent<HTMLInputElement>)=>{
          setFormData({...formData,password:e.target.value});
        }
      } required />
      <label htmlFor="password">Password</label>
    </div>
    </div>
    <button className="btn btn-primary w-100 py-2" type="submit">Login</button>
    <p className="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
  </form>
  <ToastContainer theme="dark" draggablePercent={60} position="top-center" draggable />
    </main>
  )
}

export default Page