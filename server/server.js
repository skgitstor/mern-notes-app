import Express from "express"
import mongoose from "mongoose";
import cors from "cors"
import bcrypt from "bcrypt"
import session from "express-session";
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
const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 'User' model se relation link karta hai
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    }
}, { timestamps: true }); // created_at aur updated_at apne aap add ho jayenge
const Note = mongoose.model('Note', noteSchema);
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Do users same email use nahi kar sakte
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
const corsOptions = {
    "origin": "http://localhost:5173",
    "credentials": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}
app.use(cors(corsOptions))

app.get("/", function (req, res) {
    res.json({ name: "HelloServer" })
})






app.post("/userRagister", async function (req, res) {
    const { name, email, Password } = req.body;
    const myPlaintextPassword = Password;
    //-------------------------------------------------------------
    //Async mathod................(recomended.)
    try {
        let saltRound = 10; // variable to remember the concept..
        const hash = await bcrypt.hash(myPlaintextPassword, saltRound);
        const newUser = await User({ name, email, password: hash })
        const saved = await newUser.save();

        req.session.user = {
            id: saved._id,
            email: saved.email
        };


        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            userId: saved._id,
            user: req.session.user
        })
        console.log(newUser._id)
    } catch (err) { console.log("there is some error") }
    //-------------------------------------------------------------
})
app.post('/userLogin', async (req, res) => {
    const { email, Password } = req.body;
    console.log(`${email} is loggin in`)
    try {
        const user = await User.findOne({ email: email });

        // console.log(user)

        if (!user) {
            res.status(404).json({
                message: "User not found"
            })
        } else {
            const db_id = user.id;
            const dbname = user.name;
            const dbemail = user.email;
            const dbhash = user.password


            const match = await bcrypt.compare(Password, dbhash);

            console.log(`Password confirm = ${match}`)
            if (match == true) {

                req.session.user = {
                    id: db_id,
                    email: dbemail
                };

                res.json(`${dbname} and ${db_id} logged in successfully...`);
            } else {
                res.send("Wrong Password...")
            }
        }

    } catch (err) {
        console.log(err);
        res.send(`There is some error for ${email}`)
    }
})


//-----------------------------Session - Check Point

// server.js mein yeh route add karein
app.get('/api/check-session', (req, res) => {
    console.log("Current Session Data:", req.session);

    if (req.session && req.session.user) {
        // Agar server ne session cookie se user dhoondh liya
        return res.status(200).json({
            status: "success",
            message: "Session zinda hai!",
            user: req.session.user
        });
    } else {
        // Agar cookie nahi aayi ya session destroy/expire ho chuka hai
        // return res.status(401).json({
        return res.status(401).json({
            status: "failed",
            message: "Session set nahi hua ya expire ho gaya"
        });
    }
});

app.get('/api/logout', function (req, res){
    // req.session.user = null;
    req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }

    // 2. Browser se session cookie ko clear 
    // By default express-session ka cookie name 'connect.sid' hota hai
    res.clearCookie('connect.sid', { path: '/' });

    return res.json({ message: 'Logged out successfully' });
  });

    // console.log(`Logout console : ${req.session}`)
    // res.json(req.session)

})

//------------------------------------------------------
app.listen(5000, () => {
    console.log("Server is running at http://localHost:5000")
});