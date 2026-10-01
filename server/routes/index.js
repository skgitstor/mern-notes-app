import express from "express"
import bcrypt from "bcrypt"
const router = express.Router();
import mongoose from "mongoose";
import User from "./modals/user.js";

router.get("/", function (req, res) {
    res.json({ name: "HelloServer" })
})


mongoose.connect("mongodb://localhost:27017/MERN_notes_db").then(() => {
    console.log("mongodbConnected...")
}).catch((err) => {
    console.log(`error : ${err}`)
})

//-----------------------------Session - Check Point

// server.js mein yeh route add karein
router.get('/api/check-session', async (req, res) => {
    // console.log("Current Session Data:", req.session);

    if (req.session && req.session.user) {

        try {
            const user = await User.findOne({ email: req.session.user.email });
            console.log(user)
            if (!user) {

                req.session.destroy((err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Logout failed' });
                    }
                    res.clearCookie('connect.sid', { path: '/' });

                    return res.json({ message: 'Logged out successfully' });
                });


                return res.status(401).json({
                    status: "failed",
                    message: "Aisa koi user Hai hi nahi..."
                });

            } else {

            }

        } catch (err) {
            console.log("There is some error ...")
            console.log(err)

        }


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


router.get('/api/logout', function (req, res) {
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




router.post("/userRagister", async function (req, res) {
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
        // console.log(newUser._id)
    } catch (err) {
        console.log("there is some error")
    }
})




router.post('/userLogin', async (req, res) => {
    const { email, Password } = req.body;
    // console.log(`${email} is loggin in`)
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

            // console.log(`Password confirm = ${match}`)
            if (match == true) {

                req.session.user = {
                    id: db_id,
                    name: dbname,
                    email: dbemail
                };

                res.json(`${dbname} and ${db_id} logged in successfully...`);
            } else {
                res.send("Wrong Password...")
            }
        }

    } catch (err) {
        // console.log(err);
        res.send(`There is some error for ${email}`)
    }
})



export default router;