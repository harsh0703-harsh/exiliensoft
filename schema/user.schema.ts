import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document{


    email : string ;
    password : string ;
    refresh_token : string;
    verified : boolean;
    provider : string;
    created_at : Date;
    updated_at : Date;

}

const userSchema = new Schema({

    email  :  { type : String , required  : true },
    password : { type : String },
    refresh_token : {type : String },
    verified : { type : Boolean , default : false },
    provider : { type :String , required : true , default : null},
    created_at : { type : Date , default : Date.now()},
    updated_at : { type : Date , default : Date.now()}


})

export const User = mongoose.model<IUser>("User",userSchema);