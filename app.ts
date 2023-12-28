import express from 'express';

import authRouters from './routes/auth.route.js';
import connectToMongoDB from './schema/connection.js';
import { Client } from './schema/client.schema.js';
import userRouters from './routes/user.route.js';

const app = express();
connectToMongoDB()


app.use('/auth',authRouters);
app.use("/user",userRouters)

app.get("/providers" , async (req, res)=>{

    const providers = await Client.find({});

    if(providers.length){


        return res.status(200).json(
            {
                clients : providers
            }
        )

    }else{

        return res.status(400).json({

            error : "No providers found"

        })
    }

})

app.listen(4000,()=>{

    console.log("The App Server is running on 4000");

})
