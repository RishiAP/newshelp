import { createClient, type ClientConfig } from "@sanity/client";

const config: ClientConfig = {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    useCdn: process.env.SANITY_USE_CDN==='true', // set to `false` to bypass the edge cache
    apiVersion: process.env.SANITY_API_VERSION, // use current date (YYYY-MM-DD) to target the latest API version
    token:process.env.SANITY_TOKEN
};

const client = createClient(config);

export async function uploadImage(base64Img:string):Promise<string>{
    const base64Split=base64Img.split(",");
    let extension=base64Split[0].split("/")[1].split(";")[0];
    if(extension.includes("svg")){
        extension="svg";
    }
    if(! (["jpeg","jpg","png","gif","svg","webp","heif","avif"].includes(extension))){
        throw new Error("Invalid image format");
    }
    const buffer=Buffer.from(base64Split[1],'base64');
    const uploadData=await client.assets.upload('image',buffer,{filename:"image."+extension,contentType:extension=='svg'?"image/svg+xml":"image/"+extension});
    return uploadData.url;
}

export async function deleteImageFormURL(imageUrl:string):Promise<Object>{
    const imageFile=imageUrl.split("/").slice(-1)[0];
    const dotSeperator=imageFile.lastIndexOf(".");
    const assetId="image-"+imageFile.substring(0,dotSeperator)+"-"+imageFile.substring(dotSeperator+1);
    return await client.delete(assetId);
}

export default client;