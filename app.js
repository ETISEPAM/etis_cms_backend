const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

// initialize the app
const app = express();

//Import Config
dotenv.config({ path: "./config/config.env" });

//Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());


//database configuration
const db = mongoose.connection;

mongoose.connect(process.env.DB_URI, {useNewUrlParser:true} ).then(() =>{
    console.log(`Database connected successfully on '${db.host}' to DB: ${db.name}` )
}).catch(err=>{
    console.log(`Unable to connect with the database ${err}`)
});

const users= require('./routes/api/users');

app.use('/api/users', users);

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
})