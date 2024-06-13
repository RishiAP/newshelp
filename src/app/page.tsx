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
        <MainWindow newsExist={false} news={{title:"",slug:"",content:{},topimage:"",metadesc:"",category:"",date:"",views:0,}} articles={[]} loading={false} showRescents={true}  />
      </div>
      <Footer/>
    </>
  );
}
