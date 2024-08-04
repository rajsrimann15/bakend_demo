const express = require('express')
const app = express()
const nodemailer = require('nodemailer')
require('dotenv').config()
const PORT = process.env.PORT

app.set('view engine', 'ejs')
app.use('/', express.static(__dirname + '/public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => { res.render('index') });
app.get('/index.html', (req, res) => { res.render('index') });
app.get('/contact.html', (req, res) => { res.render('contact') });
app.get('/about.html', (req, res) => { res.render('about') });

app.post('/send-email', (req, res) => {
    const { name, email, phone, course } = req.body;

    //Create transporter
    let transporter = nodemailer.createTransport({
        host: `smtp.gmail.com`,
        auth: {
            user: "dadcode10@gmail.com",
            pass: "uvbjtyjisepfzsgt"
        },
    secure: true, // Use SSL
    port: 465
    });

    let html_Content = `
    <h3>Name: ${name}</h3>
    <h3>Email: ${email}</h3>
    <h3>Phone: ${phone}</h3>
    <h3>Course: ${course}</h3>`

    // Email data
    let mailOptions = {
        from: `"${name}" <${email}>`,
        to: "director@study-spark.com",
        subject: 'New Request Form Submission',
        html: html_Content
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.json({ success: false, message: 'Sorry, something went wrong. Please try again later.'});
        } else {
            console.log('Email sent: ' + info.response);
            res.redirect('/?success=true#contact');
        }
    });

   
});

app.listen(PORT, (res, req) => { console.log(`Server is running on PORT: http://localhost:${PORT}`) })