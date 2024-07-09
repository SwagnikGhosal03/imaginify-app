import { model, models, Schema } from "mongoose";

const UserSchema=new Schema({
clerkId:{type:String,required:true,unique:true},
email:{type:String,required:true,unique:true},
username:{type:String,required:true,unique:true},
photo:{type:String,required:true},
Firstname:{type:String},
LastName:{type:String},
planId:{type:Number,default:1},
crdeitBalance:{type:Number,default:10}
});
const User=models?.User || model('User',UserSchema)
export default User