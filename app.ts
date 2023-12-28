import express from 'express';

import authRouters from './routes/auth.route.js';
import connectToMongoDB from './schema/connection.js';
import { Client } from './schema/client.schema.js';
import userRouters from './routes/user.route.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from "path"

const app = express();
connectToMongoDB()


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/auth',authRouters);
app.use("/user",userRouters);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});  

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
