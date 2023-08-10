const express = require('express');
require('dotenv').config();
// const session = require('express-session');
const router = require('./router');
const port = process.env.PORT || 3000;
require("./db/models")
const cookieParser = require('cookie-parser');
const cors = require('cors')

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cors())
app.use(express.static('public'));
app.use(express.static('uploads'));

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }));

// routes
app.use(router)

app.listen(port, () => {
    console.log(`SSO server listening http://localhost:${port}`)
});