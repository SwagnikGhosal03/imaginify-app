"use server"
import { revalidatePath } from "next/cache"
import { ConnectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"
import path from "path"
import User from "../database/model/user.model"
import Image from "../database/model/image.model"
import { redirect } from "next/navigation"
const populateUser =(query:any)=>query.populate({
   path:'author',
   model:User,
   select:'_id firstName lastName'
})
export async function addImage({image,userId,path}:AddImageParams) {
    try {
        await ConnectToDatabase()
        const author= await User.findById(userId)
        if(!author){
            throw new Error("User not found")
        }
        const newImage =Image.create({
        ...Image,
        author:author._id
        })
        revalidatePath(path)
        return JSON.parse(JSON.stringify(newImage))
    } catch (error) {
        handleError(error)
    } 
}
export async function updateImage({image,userId,path}:UpdateImageParams) {
    try {
        await ConnectToDatabase()
        const ImageToupdate= await Image.findById(image._id)
        if(!ImageToupdate || ImageToupdate.author.toHexString()!==userId){
            throw new Error("Can't Update Image")
        } 
        const updatedImage=await Image.findByIdAndUpdate(
            ImageToupdate._id,
            image,
            {new:true}
        )
        revalidatePath(path)
        return JSON.parse(JSON.stringify(updatedImage))
    } catch (error) {
        handleError(error)
    } 
}
export async function deleteImage(imageId:string) {
    try{
        await ConnectToDatabase()
        await Image.findByIdAndDelete(imageId)
    }
    catch(error){
        handleError(error)
    }
    finally{
       redirect('/')
    }
}
export async function getimagebyId(imageId:string) {
    try{
        await ConnectToDatabase()
        const image=await populateUser(Image.findById(imageId))
       if(!image){
        throw new Error("Image not found")
       }
        return JSON.parse(JSON.stringify(image)) 
    }
    catch(error){
        handleError(error)
    }
}