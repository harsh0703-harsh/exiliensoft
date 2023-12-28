import express from 'express';

import authRouters from './routes/auth.route.js';
import connectToMongoDB from './schema/connection.js';
import { Client } from './schema/client.schema.js';

const app = express();
connectToMongoDB()


app.use('/auth',authRouters);

app.get("/providers" , async (req, res)=>{

    const providers = await Client.find({});

    if(providers.length){


        res.status(200).json(
            {
                clients : providers
            }
        )

    }else{

        res.status(400).json({

            error : "No providers found"

        })
    }

})

app.listen(4000,()=>{

    console.log("The App Server is running on 4000");

})
