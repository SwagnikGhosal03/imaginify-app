import React from 'react'
import Image from 'next/image'
import { CldImage } from 'next-cloudinary'
import { dataUrl, debounce, getImageSize } from '@/lib/utils'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'
const TransformedImage = ({image,type,isTransforming,title,setIsTransforming,transformationConfig, hasDownload=false}:TransformedImageProps) => {
    const downloadhandler=()=>{
 
    }
  return (
    <div className='flex flex-col'>
<div className='flex-between'>
    <h3 className='h3-bold text-dark-600'>Transformed</h3>
    {hasDownload && (
        <button className='download-btn' onClick={downloadhandler}>
            <Image
            src={"/assets/icons/download.svg"}
            height={24}
            width={24}
            alt='download'
            className='pb-[6px]'
            />
        </button>
    )}
</div>
{image?.publicId && transformationConfig?(
    <div className='relative'>
<CldImage
      width={getImageSize(type,image,"width")}
      height={getImageSize(type,image,"height")}
      src={image?.publicId}
      alt='img'
      sizes={"(max-width:767px),100vw,50vw"}
      placeholder={dataUrl as PlaceholderValue}
      className='transformed-image'
      onLoad={()=>{
        setIsTransforming && setIsTransforming(false)
      }}
      onError={()=>{
        debounce(()=>{
            setIsTransforming && setIsTransforming(false)
        },7000)
      }}   
      {...transformationConfig}
      />
      {isTransforming &&(
        <div className='transforming-loader'>
            <Image
            src={'/assets/icons/spinner.svg'}
            height={50}
            width={50}
            alt='transforming'
            />
        </div>
      )}
    </div>
):(
    <div className='transformed-placeholder'>Transformed Image</div>
)}
    </div>
  )
}

export default TransformedImage