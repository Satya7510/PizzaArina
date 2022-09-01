require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDBStore = require('connect-mongo')
const passport = require('passport')


// Database connection
const url = "mongodb://localhost/pizza"
// const connection = mongoose.connect(url);
const connectDB = async () => {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Successfully connected with mongoDB!')
    } catch (error) {
        console.log(error.message);
    }
}

connectDB();







//Session store
// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })

//Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDBStore.create({
        mongoUrl: process.env.MONGO_CONNECTION_URL
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }   //24 hours
}))

//Passport Config
const passportInit = require('./app/config/passport')
passportInit(passport)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
// Assets
app.use(express.static('public'))
// app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

// require('./routes/web')(app)
// app.use((req, res) => {
//     res.status(404).render('errors/404')
// })

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})