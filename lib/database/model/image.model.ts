import { model, models, Schema } from "mongoose";
import { Document, Types } from 'mongoose';

export interface IImage extends Document {
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string;
    width?: number;
    height?: number;
    config?: Record<string, unknown>;
    transformationURL?: string;
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    author: {
        _id:string;
        FirstName:string;
        LastName:string;
    }
    createdAt: Date;
    updatedAt: Date;
}
const ImageSchema= new Schema({
    title:{type:String,required:true},
    transformationType:{type:String,required:true},
    publicId:{type:String,required:true},
    secureURL:{type:URL,required:true},
    width:{type:Number},
    height:{type:Number},
    config:{type:Object},
    transformationURL:{type:URL},
    aspectRatio:{type:String},
    color:{type:String},
    prompt:{type:String},
    author:{type:Schema.Types.ObjectId,ref:'user'},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
});
const Image=models?.Image||model('Image',ImageSchema)
export default Image;