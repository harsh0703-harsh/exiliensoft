import express from 'express';
import Provider from 'oidc-provider';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { Client } from './schema/client.schema.js';
import { configuration } from './constants/configs.js';

dotenv.config();

const app = express();
app.use(express.json());

console.log(process.env.DATABASE_URL);

const getClients = async () => {

  try {

    await mongoose.connect(process.env.DATABASE_URL);
    const clients = await Client.find({ is_personal : true }).select('-_id -client -is_personal').exec();
    mongoose.disconnect(); 
    return clients;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

const initializeOIDC = async () => {

  try {

    const clients = await getClients();

    console.log({clients})

    const configs :any = {

      clients:JSON.parse(JSON.stringify(clients)),
      ...configuration

    };

    const oidc = new Provider('http://localhost:3000', configs);

    app.use("/oidc", oidc.callback());

    oidc.listen(3000, () => {

      console.log('OIDC provider listening on port 3000');

    });

  } catch (err) {

    console.error("Error initializing OIDC:", err.message);
    process.exit(1); 

  }

};

initializeOIDC();
