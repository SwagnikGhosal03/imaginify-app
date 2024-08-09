"use client"
import React, { useState, useTransition } from 'react'
import { any, optional, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { title } from 'process'
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from '@/constants'
import { CustomField } from './Customfield'
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils'
import { updateCredits } from '@/lib/action/user.action'
import MediaUploader from './MediaUploader'
import TransformedImage from './TransformedImage'
import { getCldImageUrl } from 'next-cloudinary'
import { addImage, updateImage } from '@/lib/action/image.actions'
import { useRouter } from 'next/navigation'
import { Action } from '@radix-ui/react-toast'
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
})

const TransformationForm = ({action,data=null,type,creditBalance,userId,config=null}: TransformationFormProps) => {
  const transformationtype=transformationTypes[type]
  const [image, setimage] = useState(data)
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [TransformationConfig, setTransformationConfig] = useState(config)
  const [isPending,startTransition]=useTransition()
  const router=useRouter()
    const initialvalues= data && action ==='Update'?{
        title: data?.title,
        aspectRatio: data?.aspectRatio,
        color: data?.color,
        prompt: data?.prompt,
        publicId: data?.publicId,
     }: defaultValues
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:initialvalues,
      })
      // 2. Define a submit handler.
    async  function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        if(data || image){
          const transformationUrl=getCldImageUrl({
            width:image?.width,
            height:image?.height,
            src: image?.publicId,
            ...TransformationConfig
          })
          const imageData={
         title:values.title,
         publicId:image?.publicId,
         transformationType:type,
         width:image?.width,
         height:image?.height,
         config:TransformationConfig,
         secureURL:image?.secureURL,
         transformationURL:transformationUrl,
         aspectRatio:values.aspectRatio,
         prompt:values.prompt,
         color:values.color,
          }
          if(action=="Add"){
            try {
              const newImage=await addImage({
                image:imageData,
                userId,
                path:'/'
              })
              if(newImage){
                form.reset()
                setimage(data)
              router.push(`/transformations/${newImage._id}`)
              }
            } catch (error) {
              console.log(error)
            }
          }
          if(action=='Update'){
            try {
              const updatedImage=await updateImage({
                image:{
                  ...imageData,
                  _id:data._id
                },
                userId,
                path:`transformations/${data._id}`
              })
              if(updatedImage){
                router.push(`/transformations/${updatedImage._id}`)
              }
            } catch (error) {
              console.log(error)
            }
          }
        }
        setIsSubmitting(false)
      }
      const onselectfieldHandler=(value:string, onChangeField:(value:string)=>void)=>{
          const imagesize=aspectRatioOptions[value as AspectRatioKey]
          setimage((prevstate:any)=>({
             ...prevstate,
             aspectRatio:imagesize.aspectRatio,
             width:imagesize.width,
             height:imagesize.height,
          }))
          setNewTransformation(transformationtype.config)
          return onChangeField(value)
      }
      const OnInputChangeHandler=(fieldname:string,value:string,type:string,onChangeField:(value:string)=>void)=>{
       debounce(()=>{
           setNewTransformation((prevstate:any)=>({
               ...prevstate,
               [type]:{
                ...prevstate?.[type],
                [fieldname==='prompt'? 'prompt':'to']:value
               }
           }))
           onChangeField(value)
       },1000)
      }
     const OnTransformhandler =async() =>{
       setIsTransforming(true)
       setTransformationConfig(
        deepMergeObjects(newTransformation,TransformationConfig)
       )
       setNewTransformation(null)
       startTransition(async()=>{
        await updateCredits(userId,creditFee)
       })
     }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <CustomField control={form.control}
    className='w-full'
    name='title'
    formLabel='Image Title'
    render={({field})=><Input{...field} className='input-field'/>}
    />
    {type==='fill' && 
    <CustomField 
    control={form.control}
    name='aspectRatio'
    formLabel='Aspect Ratio'
    className='w-full'
    render={({field})=>(
      <Select onValueChange={(value)=>
        onselectfieldHandler(value,field.onChange)
      }>
  <SelectTrigger className="select-field">
    <SelectValue placeholder="Select size" />
  </SelectTrigger>
  <SelectContent>
   {Object.keys(aspectRatioOptions).map((key)=>(
    <SelectItem key={key} value={key} className='select-item'>
{aspectRatioOptions[key as AspectRatioKey].label}
    </SelectItem>
   ))}
  </SelectContent>
</Select>
    )}/>
    }
    {(type==='remove' || type==='recolor')&&(
      <div className="prompt-field">
        <CustomField
        control={form.control}
        name='prompt'
        formLabel={
          type==='remove'?'Object to remove':'Object to recolor'
        }
        className='w-full'
        render={({field})=>(
          <Input {...field} value={field.value} className='input-field'
          onChange={(e)=>OnInputChangeHandler(
            'prompt',
            e.target.value,
            type,
            field.onChange,
          )}
          />
        )}
        />
        {(type==='recolor')&&(
          <CustomField
          control={form.control}
          name='color'
          formLabel='Replacement Color'
          className='w-full'
          render={({field})=>(
            <Input
            className='input-field'
            onChange={(e)=>OnInputChangeHandler(
              'color',
              e.target.value,
              'recolor',
              field.onChange,
            )}
            />
          )}
          />
        )}
      </div>
)}
<div className='media-uploader-field'>
  <CustomField
  control={form.control}
  name='publicId'
  className='flex flex-col size-full'
  render={({field})=>(
    <MediaUploader
      onValueChange={field.onChange}
      setimage={setimage}
      image={image}
      type={type}
      publicId={field.value}
         />
  )}
  />
  <TransformedImage
  image={image}
  type={type}
  isTransforming={isTransforming}
  title={form.getValues().title}
  setIsTransforming={setIsTransforming}
  transformationConfig={TransformationConfig}
  />

</div>
<div className='flex flex-col gap-4'>
  <Button type='button' className='submt-button capitalize' disabled={isTransforming || newTransformation===null} onClick={OnTransformhandler}>{isTransforming? 'Transforming...':'Apply Transformation'}</Button>
  <Button type='submit' className='submit-button capitalize' disabled={isSubmitting}>{isSubmitting? 'Submitting' : 'Save Image'}</Button>
</div>
    </form>
  </Form>
  )
}

export default TransformationForm