import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document{

    state : string ;
    client : string ;
    status : string;

}

const sessionSchema = new Schema({

    state : { type : String , required :true},
    client  : {type : String , required : true},
    status : { type : String , default :"active"},

})

export const Session = mongoose.model<ISession>("Session",sessionSchema);
