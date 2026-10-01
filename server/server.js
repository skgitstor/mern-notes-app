import Express from "express"
import mongoose from "mongoose";
import cors from "cors"
import session from "express-session";
import User from "./routes/modals/user.js"
import indexRouter from "./routes/index.js"
import Note from "./routes/modals/notesmodal.js";

const app = Express();


app.use(Express.json())

app.use(session({
    secret: 'mysecret24',
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',       // Pure domain par accessible rahegi
        httpOnly: true,  // Security ke liye
        secure: false,   // Localhost (HTTP) ke liye false
        maxAge: 1000 * 60 * 60 * 24 // 1 din ka session
    }
}))

mongoose.connect("mongodb://localhost:27017/MERN_notes_db").then(() => {
    console.log("mongodbConnected...")
}).catch((err) => {
    console.log(`error : ${err}`)
})

app.use('/modals', User)
app.use('/modals', Note)
const corsOptions = {
    "origin": "http://localhost:5173",
    "credentials": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}
app.use(cors(corsOptions))
app.use('/', indexRouter)


//------------------------------------------------------
app.listen(5000, () => {
    console.log("Server is running at http://localHost:5000")
});