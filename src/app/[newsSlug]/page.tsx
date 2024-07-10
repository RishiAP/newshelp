import Footer from '@/components/Footer';
import MainWindow from '@/components/MainWindow';
import { News } from '@/models/NewsModel';
import { connect } from '@/database/dbConfig';
import Navbar from '@/components/Navbar';
connect();
export default async function Page({params}:{params:{newsSlug:string}}) {
  console.log(params)
  const response=JSON.parse(JSON.stringify(await News.findOneAndUpdate({slug:params.newsSlug},{$inc:{views:1}}).populate("author",{_id:0,name:1,profilePic:1})));
  return (
    <>
    <Navbar currentActive='' />
      <div className="container">
      <MainWindow news={response} newsExist={true} articles={[]} alertMessage='' loading={false} showRescents={true} />
      </div>
      <Footer/>
    </>
  )
};
export async function generateMetadata({params}:{params:{newsSlug:string}}) {
  const response=JSON.parse(JSON.stringify(await News.findOne({slug:params.newsSlug})));
  return {
    title: response.title,
    description:response.metadesc+"..."
  }
}