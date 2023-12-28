import express  from "express"
import dotenv from 'dotenv';
import axios from "axios";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from "path"

import connectToMongoDB from "../schema/connection.js";
import { generateRandomString } from "../constants/configs.js";
import { hashPassword,verifyGoogleToken } from "../security/user.security.js";

import { Client } from "../schema/client.schema.js";
import { Session } from "../schema/sessions.schema.js";
import { User } from "../schema/user.schema.js";


dotenv.config();

const authRouters = express.Router();
authRouters.use(express.json());
connectToMongoDB()


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

authRouters.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});  


authRouters.get("/authorize" , async (req , res)=>{

    let { provider }: any = req.query;

    if(!provider){

        return res.status(400).send("Provider Not Found");

    }
    
    provider = String(provider).toLowerCase()

    const client = await Client.findOne({client : provider});

    if(!client){

        return res.status(400).send("Provder try to login with avaialable provders");

    }else{

        const state = generateRandomString(10);
        const nonce = generateRandomString(5)

        await Session.create(

            {
                state : state , client : provider
            }

        )

        return res.status(200).json(

          { url :  `${client.issuer_url}?client_id=${client.client_id}&response_type=code&scope=openid email&redirect_uri=http://localhost:4000/redirect_here&state=${state}&nonce=${nonce}&access_type=offline&prompt=consent`}
        )
    }

})




authRouters.post("/register",async(req,res)=>{

    const body = req.body;

    if(!body.email || !body.password){

        return res.status(400).json(

            {
                error : "please provide all the details"
            }
        )

    }else{

        const isExist = await User.findOne({email : body.email});

        if(isExist){

            return res.status(200).json( { error : "The email is already in used"} )

        }else{

            const user = await User.create(
                {
                    email : body.email , 
                    password : await hashPassword(body.password),
                    provider : "password"
                }
            );

            return res.status(200).send(user);

        }

    }

})




authRouters.get("/redirect_here",async (req,res)=>{

    try{

        const { state , code } :any = req.query;

        const isSessionAvailable = await Session.findOne({state : state })

        if(!isSessionAvailable){

            return res.status(400).json({

                error : 'Session Not Found'

            })
            
        }else{

            const  is_client = await Client.findOne({client : isSessionAvailable.client})


            const data = new URLSearchParams();

            data.append('code',code)
            data.append('client_id',is_client.client_id),
            data.append('client_secret',is_client.client_secret)
            data.append('grant_type', 'authorization_code');
            data.append('redirect_uri', 'http://localhost:4000/redirect_here');
            data.append("access_type","offline"),
            data.append("prompt","consent")

            const response = await axios.post(is_client.code_exchange_url,data,{

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
            })
            
            if(response.data){

                isSessionAvailable.status = "completed"
                isSessionAvailable.save()

                const record = await verifyGoogleToken(response.data.id_token,is_client.client_id);

                await User.findOneAndUpdate(
                    
                    {
                        email : record.email , 
                       
                    },
                    {
                        verified : record.verified,
                        provider : record.provider,
                        refresh_token : (response.data.refresh_token) ? response.data.refresh_token : null,
                    },
                    { upsert : true , new : true} 
                )



                return res.status(200).json(response.data)

            }else{


                return res.status(400).json({

                    error : 'Invalid Credentials'
                })
            }


        }



    }catch(err){

        console.log(err);

        return res.status(500).send("Internal Server Error")

    }
})



authRouters.post("/generate/access_token",async (req,res)=>{

    const body = req.body;

    if(!body.refresh_token && !body.provider ){

        res.send(400).json({ err : "refresh token not found"});

    }else{

        const client = await Client.findOne({client : body.provider});

        if(!client){

            return res.status(400).json(

               { error : "invalid provider.."}
            )

        }else{


            const data = new URLSearchParams();

            data.append("refresh_token",body.refresh_token)
            data.append("grant_type","refresh_token")
            data.append("client_secret",client.client_secret)
            data.append("client_id",client.client_id)

            try{

                const response = await axios.post(client.code_exchange_url , data , {

                    headers : {
                        'Content-Type':'application/x-www-form-urlencoded'
                    }
                })
    
                if(response.data){

                    return res.status(200).json(response.data)
    
                }else{

                    return res.status(400).json(
                        {
                            error : "Invalid Refresh Code"
                        }
                    )
                }

            }catch(err){

                return res.status(500).json({
                    error : err.message
                })

            }

        }

    }
})



export default authRouters;