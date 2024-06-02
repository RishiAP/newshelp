"use client";
import Footer from "@/components/Footer";
import MainWindow from "@/components/MainWindow";
import Navbar from "@/components/Navbar";
import TopNews from "@/components/TopNews";

export default function Home() {
  return (
    <>
      <Navbar currentActive=""/>
      <div className="container">
        <TopNews/>
        <MainWindow news={{title:"",content:{},metadesc:"",topimage:"",category:"",date:""}} newsExist={false} articles={[]}/>
      </div>
      <Footer/>
    </>
  );
}
