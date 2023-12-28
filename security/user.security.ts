import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();
import * as bcrypt from 'bcrypt';

export const verifyGoogleToken = async( token , client_id) =>{

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: client_id,  
     
  });

  const payload = ticket.getPayload();

  return {

    email : payload['email'],
    verified : payload['email_verified'],
    provider : "google"

  }


};

export const hashPassword = (password : string) : Promise<string> =>{

    return bcrypt.hash(password , 10);
    
}



