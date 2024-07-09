import { Mongoose } from "mongoose";
import mongoose from "mongoose";
const MONGODB_URL=process.env.MONGODB_URL
interface MongooseConnnection{
    conn: Mongoose|null;
    promise:Promise<Mongoose> |null
}
let cached :MongooseConnnection= (global as any).mongoose
if(!cached){
cached=(global as any).mongoose={
    conn:null,
    promise:null
}
}
export const ConnectToDatabase =async()=>{
    if(cached.conn) return cached.conn;
    if(!MONGODB_URL) throw new Error("Missing mongodb url")
    cached.promise=cached.promise || mongoose.connect(MONGODB_URL,{
dbName:'Imaginify-App',bufferCommands:false
})
cached.conn=await cached.promise
return cached.conn
}