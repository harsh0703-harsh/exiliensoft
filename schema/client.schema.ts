import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {

    client : string;
    grant_types : [];
    redirect_uris : [];
    response_types : [];
    client_id: string;
    client_secret: string;
    is_personal : boolean;
    issuer_url : string;
    code_exchange_url : string
   
}


const clientSchema = new Schema({

    client : { type :String , required : true},
    grant_types : {type : Array , required : true},
    redirect_uris : {type : Array , required : true},
    response_types : {type : Array , required : true},
    client_id: { type: String, required: true },
    client_secret: { type: String, required: true },
    is_personal : { type : Boolean , required : true},
    issuer_url : { type : String , required : true },
    code_exchange_url : { type : String , required : true},

});


export const Client = mongoose.model<IClient>('Client', clientSchema);