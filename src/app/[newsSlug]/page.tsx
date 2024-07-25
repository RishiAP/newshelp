import Footer from '@/components/Footer';
import MainWindow from '@/components/MainWindow';
import { News } from '@/models/NewsModel';
import { connect } from '@/database/dbConfig';
import Navbar from '@/components/Navbar';
import ThemeChanger from '@/components/ThemeChanger';
connect();
export default async function Page({params}:{params:{newsSlug:string}}) {
  const article=JSON.parse(JSON.stringify(await News.findOneAndUpdate({slug:params.newsSlug},{$inc:{views:1}},{projection: { priority: 0, category: 0 },new:true}).populate("author",{_id:0,name:1,profilePic:1,bio:1,socialLinks:1})));
  return (
    <>
    <ThemeChanger />
    <Navbar currentActive='' />
      <div className="container">
        <MainWindow news={article} newsExist={true} articles={[]} alertMessage='' loading={false} showRescents={true} />      
      </div>
      <Footer/>
    </>
  )
};
export async function generateMetadata({ params }: { params: { newsSlug: string } }) {
  // Fetch the article and populate the author field
  const article = JSON.parse(JSON.stringify(await News.findOne({ slug: params.newsSlug }).populate('author')));

  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

  if (article == null) {
    return {
      title: "Article not found!",
      description: "The article you are looking for is not found!",
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: "Article not found!",
        description: "The article you are looking for is not found!",
        url: `${baseUrl}/news/${params.newsSlug}`,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: "Article not found!",
        description: "The article you are looking for is not found!",
      }
    };
  } else {
    return {
      title: article.title,
      description: article.metadesc + "...",
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: article.title,
        description: article.metadesc + "...",
        url: `${baseUrl}/news/${params.newsSlug}`,
        type: "article",
        images: [
          {
            url: article.topimage, // Construct absolute URL
            width: 800,
            height: 600,
            alt: article.title,
          }
        ],
        site_name: "Your Site Name",
        locale: "en_US",
        published_time: article.createdOn,
        modified_time: article.dateUpdated,
        authors: [article.author.name]
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.metadesc + "...",
        image: article.topimage, // Construct absolute URL
        site: "@yourtwitterhandle",
      },
      robots: {
        index: true,
        follow: true,
      },
      additionalMetaTags: [
        {
          name: "author",
          content: article.author.name,
        },
        {
          name: "theme-color",
          content: "#317EFB",
        }
      ],
      canonical: `${baseUrl}/${params.newsSlug}`
    };
  }
}

