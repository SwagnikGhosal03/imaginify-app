import { model, models, Schema } from "mongoose";

const TransactionSchema= new Schema({
crediteAt:{type:Date,default:Date.now},
stripeId:{type:String,required:true,unique:true},
amount:{type:Number,required:true},
plan:{type:String},
crdits:{type:Number},
buyer:{type:Schema.Types.ObjectId,ref:'User'}
});
const Transaction=models?.Transaction|| model('Transaction',TransactionSchema)
export default Transaction