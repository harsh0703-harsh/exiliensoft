import express  from "express"
import dotenv from 'dotenv'

import connectToMongoDB from "../schema/connection.js"

import { User } from "../schema/user.schema.js"
import { protectedGuard } from "../middlewares/guard.js";


dotenv.config();


const userRouters = express.Router();
userRouters.use(express.json());
connectToMongoDB()


userRouters.get('/',protectedGuard, async (req : any,res)=>{

    const user = req.user;

    const record = await User.findById(user);

    if(!record){

        return  res.status(400).json( { err : "user not valid "})

    }else{

        return res.status(200).json(record)
    }


})

export default userRouters;