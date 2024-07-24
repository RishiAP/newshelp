"use client";
import { Article_without_content } from '@/app/page';
import React, { ReactEventHandler, useEffect, useState } from 'react'
import NewsCard from './NewsCard';
import { AuthorUpdateModal } from './AuthorUpdateModal';
import { centerCrop, Crop, makeAspectCrop, PercentCrop, PixelCrop } from 'react-image-crop';
import { ImageCropper } from './ImageCropper';
import axios from 'axios';
import ContentLoadSpinner from './ContentLoadSpinner';
import { SuperAdminCreateModals } from './SuperAdminCreateModals';
import { Id, toast } from 'react-toastify';
import { ImageHandleModal } from './ImageHandleModal';
export type Admin = {
    name: string,
    email: string,
    bio:null|string,
    profilePic:null|string,
    socialLinks:null|{instagram:string|null,twitter:string|null,facebook:string|null},
    createdOn:Date|null,
    isSuperAdmin:boolean
}
type Priority="TopMost"|"Headline"|"none";
type Filter={date:string,category:string,priority:Priority};
export default function AdminDashboard(){
  const [articles, setArticles] = useState<Article_without_content[]>([]);
  const [author, setAuthor] = useState<Admin>({name:"",email:"",bio:null,profilePic:null,socialLinks:null,createdOn:null,isSuperAdmin:false});
    const [categories, setCategories] = useState<{_id:string,value:string}[]>([]);
    const [articlePageLoading, setArticlePageLoading] = useState<boolean>(false);
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [filterLoading, setFilterLoading] = useState<boolean>(false);
    const [scrollLoading, setScrollLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<Filter>({date:"",category:"all",priority:"none"});
    const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const isMobile=()=> {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent);
    return check;
  };
  const setAuthorData=()=>{
    (document.getElementById("authorName") as HTMLInputElement).value=author.name;
    (document.getElementById("authorBio") as HTMLTextAreaElement).value=author.bio?author.bio:"";
    (document.getElementById("instagram_usn") as HTMLInputElement).value=author.socialLinks?.instagram?author.socialLinks.instagram:"";
    (document.getElementById("twitter_usn") as HTMLInputElement).value=author.socialLinks?.twitter?author.socialLinks.twitter:"";
    (document.getElementById("facebook_usn") as HTMLInputElement).value=author.socialLinks?.facebook?author.socialLinks.facebook:"";
  }
  function handleCommonError(err:any){
    if(err.response.status==500)
      toast.error("Internal server error",{autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
      else if(err.response.status==401){
        const toastId=toast.loading("You are not authorized to view this page. Logging out...",{autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
        axios.post("/api/logout").then((res)=>{
          toast.update(toastId,{render:"You have been logged out!",type:"info",isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
          setTimeout(()=>{window.location.href="/admin-login"},2000);
        }).catch((err)=>{
          console.log(err);
        });
      }
      else
        toast.error(err.response.data.error,{isLoading:false,autoClose:false,closeButton:true,draggable:true,draggablePercent:60});
  }
  useEffect(()=>{
    if(isMobile()){
      const overlay=document.querySelector(".date-overlay");
      overlay?.classList.add("d-block");
      overlay?.classList.remove("d-none");
    }
    axios.get("/api/category").then((res)=>{
      setCategories(res.data);
    });
    axios.get("/api/author_profile").then((res) => {
      setAuthor(res.data);
      setPageLoading(false);
    }
    ).catch((err) => {
      handleCommonError(err);
      console.log(err);
    });
  },[]);
  useEffect(()=>{
    setAlertMessage("");
    setFilterLoading(true);
    localStorage.setItem('shouldFetch',"true");
    axios.post("/api/get_author_articles",filter).then((res) => {
      setArticles(res.data);
      if(res.data.length==0){
        setAlertMessage("No articles found");
      }
    }
    ).catch((err) => {
      handleCommonError(err);
      console.log(err);
    }).finally(()=>{
      setFilterLoading(false);
    });
  },[filter]);
  const handleDateInput=(e:React.ChangeEvent<HTMLInputElement>)=>{
    if(isMobile()){
      const overlay=document.querySelector(".date-overlay");
      if(e.currentTarget.value==''){
        overlay?.classList.add("d-block");
        overlay?.classList.remove("d-none");
      }
      else{
        overlay?.classList.add("d-none");
        overlay?.classList.remove("d-block");
      }
    }
    setFilter({...filter,date:e.currentTarget.value});
  }
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrc(reader.result as string);
        (document.getElementById("profileImageSettingModalTriggerButton") as HTMLButtonElement)?.click();
    });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const [croppedImageUrl, setCroppedImageUrl] = useState<Blob | null>(null);
  const onCropComplete=(crop:PixelCrop,percentageCrop:PercentCrop)=>{
    makeCroppedImage(crop);
  }
  const makeCroppedImage = (crop: PixelCrop) => {
    if (!crop.width || !crop.height || !src) {
      return;
    }

    const image = new Image();
    image.src = src;

    const canvas = document.createElement('canvas');
    const mainCroppingImage=document.getElementById("mainCroppingImage") as HTMLImageElement;
    const scaleX = mainCroppingImage.naturalWidth / mainCroppingImage.width;
    const scaleY = mainCroppingImage.naturalHeight / mainCroppingImage.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          setCroppedImageUrl(blob);
        }
      }, 'image/jpeg');
    }
  };
  useEffect(()=>{
    const mainWindow=document.getElementById("articles");
    window.onscroll=()=>{
      if(articles && articles.length>4){
        if((mainWindow?.scrollHeight || 0)+(mainWindow?.getBoundingClientRect().y || 0)<window.innerHeight+300){
          if(localStorage.getItem('shouldFetch')=="true"){
            setScrollLoading(true);
            const options:Filter & {lastDate:string}={...filter, lastDate:articles[articles.length-1].createdOn};
            axios.post(`/api/get_author_articles`,options).then((res) => {
              setArticles([...articles,...res.data]);
              if(res.data.length<5){
                localStorage.setItem('shouldFetch',"false");
                setScrollLoading(false);
                setAlertMessage("No more articles found");
                console.log("No more articles found");
              }
              else{
                localStorage.setItem('shouldFetch',"true");
              }
            });
            localStorage.setItem('shouldFetch',"false");
          }
        }
        
      }
    }
  },[articles])
  useEffect(()=>{
    console.log(croppedImageUrl);
  },[croppedImageUrl]);
  const onImageLoaded:ReactEventHandler<HTMLImageElement>=(e)=>{
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget
    const extra=width<800?(200-25/100*width)/width*100:0;
  const crop = centerCrop(
    makeAspectCrop(
      {
        // You don't need to pass a complete crop into
        // makeAspectCrop or centerCrop.
        unit: '%',
        width: 25+extra,
      },
      1,
      width,
      height
    ),
    width,
    height
  )

  setCrop(crop);
    }
    ;
    useEffect(()=>{
        document.getElementById("profileImageSettingModal")?.addEventListener("hide.bs.modal",()=>{
            setSrc("");
            setCroppedImageUrl(null);
            const inputTag=document.getElementById("adminImageInput") as HTMLInputElement;
            if(inputTag){
                inputTag.value="";
                inputTag.type="text";
                inputTag.type="file";
            }
        });
    },[setSrc,setCroppedImageUrl]);
  return (
    <>
    <AuthorUpdateModal setAuthor={setAuthor} />
    <ImageHandleModal setAuthor={setAuthor}/>
    <ImageCropper src={src} crop={crop} croppedImageUrl={croppedImageUrl} onCropComplete={onCropComplete} setCrop={setCrop} onImageLoaded={onImageLoaded} setAuthor={setAuthor} />
        <div className="d-flex justify-content-between mb-3" id='profileInfo'>
            <div id="profileImage" className='mt-5' data-bs-toggle="modal" data-bs-target="#imageHandleModal">
                {
                    author.profilePic? <img src={author.profilePic} alt="Profile Picture" className="img-fluid" />:<i className="bi bi-person-circle"></i>
                }
                <label htmlFor="adminImageInput">
                <input type="file" accept="image/*" id="adminImageInput" onChange={onSelectFile} className='d-none' />
                </label>
            </div>
            <div id="authorInfo">
                <div className='d-flex justify-content-between align-items-center'><p className='d-flex align-items-center gap-2 fs-3 m-0'><i className="bi bi-person-check user-icon"></i> <span style={{marginTop:"0.85rem"}}><span className='fs-3'>{author.name}</span></span></p><button type='button' onClick={setAuthorData} data-bs-toggle="modal" data-bs-target="#authorUpdateModal" style={{border:"none",outline:"none",background:"none"}}><i className="bi bi-gear-wide fs-4 settings-icon"></i></button></div>
                <p className='d-flex align-items-center gap-2 fs-4 mb-0'><i className="bi bi-envelope-check email-icon"></i> <span className='mt-2'><span className='fs-5'>{author.email}</span></span></p>
                {
                    author.bio && <p className='d-flex align-items-center gap-2 fs-4 mb-0'><i className="bi bi-pen bio-icon"></i> <span className='mt-2'><span className='fs-5'>{author.bio}</span></span></p>
                }
                {
                    author.createdOn && <p className='d-flex align-items-center gap-2 fs-4 '><i className="bi bi-calendar-check calendar-check-icon"></i> <span className='mt-2'><span className='fs-5'>joined on {new Date(author.createdOn).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                  })
                  }</span></span></p>
                }
                {
                    author.socialLinks && <div className='d-flex gap-3'>
                        {
                            author.socialLinks.instagram && <a href={`https://instagram.com/${author.socialLinks.instagram}`} target="_blank" rel="noreferrer"><i className="bi bi-instagram fs-4 instagram-icon-colored"></i></a>
                        }
                        {
                            author.socialLinks.twitter && <a href={`https://twitter.com/${author.socialLinks.twitter}`} target="_blank" rel="noreferrer"><i className="bi bi-twitter fs-4 twitter-icon-colored"></i></a>
                        }
                        {
                            author.socialLinks.facebook && <a href={`https://facebook.com/${author.socialLinks.facebook}`} target="_blank" rel="noreferrer"><i className="bi bi-facebook fs-4 facebook-icon-colored"></i></a>
                        }
                    </div>
                }
                {
                    author.isSuperAdmin && <>
                    <SuperAdminCreateModals/>
                    <div className='w-100 d-flex flex-wrap justify-content-center align-items-center'>
                      <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#createCategoryModal">Create category</button>
                      <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#createAuthorModal">Create author</button>
                    </div></>
                }
            </div>
        </div>
        <div id="filters">
        <div className="accordion" id="accordionExample">
  <div className="accordion-item d-flex justify-content-center flex-column align-items-center" style={{border:"none"}}>
    <h2 className="accordion-header" style={{width:"fit-content",minWidth:"90px"}}>
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
      <i className="bi bi-funnel fs-4"></i>
      </button>
    </h2>
      <hr className='w-100 mb-0' />
    <div id="collapseOne" className="accordion-collapse collapse w-100" data-bs-parent="#accordionExample">
      <div className="accordion-body px-0">
        <div className="d-flex gap-2 flex-wrap justify-content-center">
          <div className="position-relative d-flex align-items-center justify-content-center">
            <label htmlFor="dateFilter" className="position-absolute date-overlay d-none">
              dd/mm/yyyy
            </label>
        <input type="date" name="dateFilter" id="dateFilter" className='form-control' style={{width:"fit-content",minWidth:"100px"}} onInput={handleDateInput} />
          </div>
        
        <select name="categoryFilter" id="categoryFilter" className='form-select' style={{width:"fit-content"}} defaultValue={"all"} onInput={(e:React.ChangeEvent<HTMLSelectElement>)=>{
          setFilter({...filter,category:e.currentTarget.value});
        }} >
          <option value="" disabled>Category</option>
          <option value="all">All</option>
            {
              categories.map((cat,index)=>{
                return <option key={index} value={cat._id}>{cat.value}</option>
              })
            }
        </select>
        <select name="priorityFilter" id="priorityFilter" className='form-select' style={{width:"fit-content"}} defaultValue={"none"} onInput={(e:React.ChangeEvent<HTMLSelectElement>)=>{
          setFilter({...filter,priority:e.currentTarget.value as Priority});
        }} >
          <option value="" disabled>Priority</option>
          <option value="none">None</option>
          <option value="TopMost">TopMost</option>
          <option value="Headline">Headline</option>
        </select>
        </div>
        <hr className='w-100' />
      </div>
    </div>
  </div>
  
</div>
        </div>
        <div id="articles" className='mt-3'>
          <ContentLoadSpinner loading={filterLoading} classProperties='w-100 mt-0 mb-3' />
            {
              articles.map((article,index)=>{
                return (
                  <NewsCard key={index} article={article} onClick={()=>{setArticlePageLoading(true);}} />
                );
              })
            }
            <div className={`alert alert-info text-center ${alertMessage==""?"d-none":""}`} role="alert">
                {alertMessage}
              </div>
            <ContentLoadSpinner loading={scrollLoading} classProperties='w-100 mt-0 mb-3' />
            <ContentLoadSpinner loading={articlePageLoading} classProperties='vw-100 vh-100 align-items-center position-fixed top-0 start-0' style={{zIndex:2,background:"rgb(255 255 255 / 25%)"}}/>
            <ContentLoadSpinner loading={pageLoading} classProperties='vw-100 vh-100 align-items-center position-fixed top-0 start-0' style={{zIndex:2,background:"#212529"}}/>
        </div>
    </>
  )
}
