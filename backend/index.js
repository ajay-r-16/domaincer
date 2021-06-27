const express = require('express');
const mainRoutes = require('./Routes/mainRoutes');
const commonRoutes = require('./Routes/commonRoutes');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/user',mainRoutes);
app.use(commonRoutes);




app.listen( process.env.PORT || 5000,()=>{console.log("SERVER RUNNING")});