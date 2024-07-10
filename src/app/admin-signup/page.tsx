"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
type formDataType = {
  email:string,
  password:string,
  cpassword:string,
  name:string
}
const Page = () => {
  const [formData, setFormData] = useState<formDataType>({email:"",password:"",cpassword:"",name:""});
  const [shouldSignup, setShouldSignup] = useState(false);
  async function submitSignup(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    let p;
    let t:any;
    if(shouldSignup){
      t=toast.loading("Verifying...");
      axios.post('/api/admin-signup-verify',{...formData,token:window.location.href.split('token=')[1]}).then((res)=>{
        toast.update(t,{render:"Account created successfully! Please login to continue",type:"success",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
        window.location.href="/admin-login";
      }).catch((err:any)=>{
        toast.update(t,{render:err.response.data.message,type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
      });
    }
    else{
      p=axios.post('/api/admin-signup',{email:formData.email});
      t=toast.loading("Sending verification email...");
        p.then((res)=>{
          console.log(res.data);
          toast.update(t,{render:"Please refer to the email sent to continue",type:"success",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
        }).catch((err)=>{
          if(err.response.status==409)
          toast.update(t,{render:err.response.data.message,type:"warning",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
          else if(err.response.status==404)
          toast.update(t,{render:err.response.data.message,type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
        else
        toast.update(t,{render:"Something went wrong",type:"error",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
          console.log(err.response.data);
        });
    }
  }
  useEffect(()=>{
    if(window.location.href.includes('token')){
      setShouldSignup(true);
    }
  },[]);
  return (
    <main className='form-signin w-100 m-auto h-100 d-flex align-items-center'>
    <form onSubmit={submitSignup} className='w-100'>
    <h1 className="h3 mb-3 fw-normal">Please sign up</h1>
    <div className={`${!shouldSignup? "d-none ":""}input-cover-div`}>
    <div className="form-floating">
      <input type="text" className="form-control" id="name" placeholder="Name" onInput={
        (e:React.ChangeEvent<HTMLInputElement>)=>{
          setFormData({...formData,name:e.target.value})
        }
      } required={shouldSignup} />
      <label htmlFor="name">Name</label>
    </div>
    </div>
    <div className="input-cover-div">
    <div className="form-floating">
      <input type="email" className="form-control" id="email" placeholder="name@example.com" onInput={
        (e:React.ChangeEvent<HTMLInputElement>)=>{
          setFormData({...formData,email:e.target.value})
        }
      } required />
      <label htmlFor="email">Email address</label>
    </div>
    </div>
    <div className={`${!shouldSignup? "d-none ":""}input-cover-div`}>
    <div className="form-floating">
      <input type="password" className="form-control" id="password" placeholder="Password" onInput={
        (e:React.ChangeEvent<HTMLInputElement>)=>{
          setFormData({...formData,password:e.target.value})
        }
      } required={shouldSignup} />
      <label htmlFor="password">Password</label>
    </div>
    </div>
    <div className={`${!shouldSignup? "d-none ":""}input-cover-div`}>
    <div className="form-floating">
      <input type="password" className="form-control" id="cpassword" placeholder="Password" onInput={
        (e:React.ChangeEvent<HTMLInputElement>)=>{
          setFormData({...formData,cpassword:e.target.value})
        }
      } required={shouldSignup} />
      <label htmlFor="cpassword">Confirm Password</label>
    </div>
    </div>
    <button className="btn btn-primary w-100 py-2" type="submit">Sign up</button>
    <p className="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
  </form>
  <ToastContainer theme="dark" draggablePercent={60} position="top-center" draggable />
    </main>
  )
}

export default Page