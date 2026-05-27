const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

/* CONTACT FORM */

app.post("/send-message", async (req, res) => {

    const { name, email, subject, message } = req.body;

    try {

        const transporter = nodemailer.createTransport({

            service: "gmail",

            auth: {

                user: "kiran.banavath418@gmail.com",

                pass: "Priyansh@2021"

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

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});