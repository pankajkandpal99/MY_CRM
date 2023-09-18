const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;

db.once('open', ()=>{
    console.log("Successfully connected to mongoDB.");
});
db.on("error", (error)=>{
    console.log("Error connected to mongoDB : ", error);
    process.exit();
});

require('./routes/auth.route')(app);
require('./routes/user.route')(app);
require('./routes/ticket.route')(app);
require('./routes/comment.route')(app);

app.listen(process.env.PORT, ()=>{
    console.log(`Server is up and listening to Port : ${process.env.PORT}`);
});
