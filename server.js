const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

/* MIDDLEWARE */

app.use(express.json());
app.use(express.static("public"));

/* MONGODB CONNECTION */

mongoose.connect(
"mongodb://kiranbanavath418_db_user:Kiran1990@ac-yboehgd-shard-00-00.3czp3mc.mongodb.net:27017,ac-yboehgd-shard-00-01.3czp3mc.mongodb.net:27017,ac-yboehgd-shard-00-02.3czp3mc.mongodb.net:27017/schoolDB?ssl=true&replicaSet=atlas-sfokvs-shard-0&authSource=admin&retryWrites=true&w=majority"
)

.then(() => {

    console.log("MongoDB Connected");

})

.catch((err) => {

    console.log(err);

});

/* NEWS SCHEMA */

const newsSchema = new mongoose.Schema({

    headline:String,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

const News =
mongoose.model("News", newsSchema);

/* ADMISSION SCHEMA */

const admissionSchema = new mongoose.Schema({

    studentName:String,

    fatherName:String,

    mobile:String,

    email:String,

    className:String,

    address:String,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

const Admission =
mongoose.model("Admission", admissionSchema);

/* HOME PAGE */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});
/* GALLERY SCHEMA */

const gallerySchema = new mongoose.Schema({

    imageUrl:String,

    title:String,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

const Gallery =
mongoose.model("Gallery", gallerySchema);

/* CONTACT FORM */

app.post("/send-message", async (req, res) => {

    const { name, email, subject, message } = req.body;

    try {

        const transporter =
        nodemailer.createTransport({

            service: "gmail",

            auth: {

                user: "kiran.banavath418@gmail.com",

                pass: "YOUR_GMAIL_APP_PASSWORD"

            }

        });

        const mailOptions = {

            from: email,

            to: "kiran.banavath418@gmail.com",

            subject: subject,

            html: `

                <h2>New Website Message</h2>

                <p><b>Name:</b> ${name}</p>

                <p><b>Email:</b> ${email}</p>

                <p><b>Subject:</b> ${subject}</p>

                <p><b>Message:</b></p>

                <p>${message}</p>

            `

        };

        await transporter.sendMail(mailOptions);

        res.json({

            success: true,

            message: "Message Sent Successfully"

        });

    } catch (error) {

        console.log(error);

        res.json({

            success: false,

            message: "Failed To Send Message"

        });

    }

});

/* ADMIN LOGIN */

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if(
        username === "admin" &&
        password === "lakshya123"
    ){

        res.json({

            success:true,

            message:"Login Successful"

        });

    } else {

        res.json({

            success:false,

            message:"Invalid Username or Password"

        });

    }

});

/* SAVE ADMISSION */

app.post("/admission", async (req, res) => {

    try {

        const newAdmission =
        new Admission(req.body);

        await newAdmission.save();

        res.json({

            success:true,

            message:"Admission Submitted Successfully"

        });

    } catch(error){

        console.log(error);

        res.json({

            success:false,

            message:"Failed To Submit Admission"

        });

    }

});

/* GET ADMISSIONS */

app.get("/admissions", async (req, res) => {

    try {

        const admissions =
        await Admission.find()
        .sort({ createdAt:-1 });

        res.json(admissions);

    } catch(error){

        console.log(error);

        res.json({

            message:"Error Fetching Admissions"

        });

    }

});

/* SAVE NEWS */

app.post("/save-news", async (req, res) => {

    try {

        const { headline } = req.body;

        await News.deleteMany({});

        const newNews = new News({

            headline

        });

        await newNews.save();

        res.json({

            success:true,

            message:"News Updated Successfully"

        });

    } catch(error){

        console.log(error);

        res.json({

            success:false,

            message:"Failed To Update News"

        });

    }

});

/* GET NEWS */

app.get("/latest-news", async (req, res) => {

    try {

        const latestNews =
        await News.findOne()
        .sort({ createdAt:-1 });

        res.json(latestNews);

    } catch(error){

        console.log(error);

        res.json({

            message:"Error Fetching News"

        });

    }

});

/* SERVER */

/* =========================
   GALLERY APIs
========================= */

/* ADD GALLERY PHOTO */

app.post("/add-gallery-photo", async (req, res) => {

    try {

        const { imageUrl, title } = req.body;

        const newPhoto = new Gallery({

            imageUrl,
            title

        });

        await newPhoto.save();

        res.json({

            success:true,
            message:"Photo Added Successfully"

        });

    } catch(error){

        console.log(error);

        res.json({

            success:false,
            message:"Failed To Add Photo"

        });

    }

});

/* GET GALLERY PHOTOS */

app.get("/gallery-photos", async (req, res) => {

    try {

        const photos =
        await Gallery.find()
        .sort({ createdAt:-1 });

        res.json(photos);

    } catch(error){

        console.log(error);

        res.json([]);

    }

});

/* UPDATE PHOTO TITLE */

app.put("/update-gallery-title/:id", async (req, res) => {

    try {

        const { title } = req.body;

        await Gallery.findByIdAndUpdate(

            req.params.id,

            {
                title:title
            }

        );

        res.json({

            success:true,
            message:"Title Updated Successfully"

        });

    } catch(error){

        console.log(error);

        res.json({

            success:false,
            message:"Failed To Update Title"

        });

    }

});

/* DELETE GALLERY PHOTO */

app.delete("/delete-gallery-photo/:id", async (req, res) => {

    try {

        await Gallery.findByIdAndDelete(
            req.params.id
        );

        res.json({

            success:true,
            message:"Photo Removed Successfully"

        });

    } catch(error){

        console.log(error);

        res.json({

            success:false,
            message:"Failed To Remove Photo"

        });

    }

});

app.listen(3000, () => {

    console.log("Server Running On Port 3000");

});

