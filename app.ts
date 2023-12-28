import express from 'express';

import authRouters from './routes/auth.route.js';

const app = express();

app.use('/auth',authRouters);

app.listen(4000,()=>{

    console.log("The App Server is running on 4000");

})
