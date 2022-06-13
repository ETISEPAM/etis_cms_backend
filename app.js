const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// initialize the app
const app = express();
//Middlewares
app.use(bodyParser.urlencoded({
extended:true
}));

app.use(bodyParser.json());

app.use(cors());
//setting the static directory
app.use(express.static(path.join(__dirname, 'public')))

//database configuration
const db = require('./config/keys').mongoURI;
mongoose.connect(db, {useNewUrlParser:true} ).then(() =>{
    console.log(`Database connected successfully ${db}` )
}).catch(err=>{
    console.log(`Unable to connect with the database ${err}`)
});

const users= require('./routes/api/users');
app.use('/api/users',users);

app.get('/api/users/login', (req,res) =>{
    return res.send(req.body)
})


const PORT=process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
})