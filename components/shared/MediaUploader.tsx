"use client";
import React from 'react'
import { useToast } from '../ui/use-toast'
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { dataUrl, getImageSize } from '@/lib/utils';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

type MediaUploaderprops={
  onValueChange:(type:string)=>void
  setimage:React.Dispatch<any>
  publicId:string
  type:string
  image:any
}
const MediaUploader = ({onValueChange,publicId,type,image,setimage}:MediaUploaderprops) => {
    const {toast}=useToast()
const onSucessUploadHandler =(result:any)=>{
  console.log("Upload successful:", result); 
  setimage((prevstate:any)=>({
    ...prevstate,
    publicId:result?.info?.public_id,
    width:result?.info?.width,
    height:result?.info?.height,
   secureUrl:result?.info?.secure_url
  }))
  onValueChange(result?.info?.public_id)
 toast({
    title:'Image Uploaded Successfully',
    description:'1 credit deducted from your account',
    duration:5000,
    className:'success-toast'
 })
}
const onErrorUploadHandler=()=>{
toast({
    title:'Error Uploading Image',
    description:'Please try again',
    duration:5000,
    className:'error-toast'
})
}
console.log("Current publicId:", publicId);
  return (
    <CldUploadWidget
    uploadPreset='sg_imaginify'
    options={{
        multiple:false,
        resourceType:'image',
    }}
    onSuccess={onSucessUploadHandler}
    onError={onErrorUploadHandler}
    >
{({open})=>(
  <div className='flex flex-col'>
    <h3 className='h3-bold text-dark-600 text-xs'>Original</h3>
    {publicId?(
      <>  
      <div className='cursor-pointer overflow-hidden rounded-[10px]'>
      <CldImage
      width={getImageSize(type,image,"width")}
      height={getImageSize(type,image,"height")}
      src={publicId}
      alt='img'
      sizes={"(max-width:767px),100vw,50vw"}
      placeholder={dataUrl as PlaceholderValue}
      className='media-uploader_cldImage'   
      />
    </div>
    </>
    ):(
      <div className='media-uploader_cta' onClick={()=> open()}>
        <div className='media-uploader_cta-image'>
        <Image
        src={'/assets/icons/add.svg'}
        height={24}
        width={24}
        alt='add image'
        />
        </div>
        <p className='p-14-medium'>Click here to Upload an Image</p>
      </div>
    )}
  </div>
)}
    </CldUploadWidget>
  )
}

export default MediaUploader