const express= require('express');
const mongoose = require('mongoose');
const app = express();
const port= 3001;

app.use(express.json());

const key="mongodb+srv://piuridarwin:zP8anMOfscLbe1xJ@flats.kxkr02i.mongodb.net/flat-finder?retryWrites=true&w=majority&appName=Flats";

const OPT={
    useNewUrlParser:true
};

const authRoutes= require('./api/auth/routes');
const usersRoutes= require('./api/users/routes');
const flatsRoutes= require('./api/flats/routes');


app.use('/auth',authRoutes);
app.use('/users',usersRoutes);
app.use('/flats',flatsRoutes);




mongoose.connect(key,OPT);
app.listen(port)
