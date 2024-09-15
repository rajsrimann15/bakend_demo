const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => { res.render('index'); });
app.get('/index.html', (req, res) => { res.render('index'); });
app.get('/contact.html', (req, res) => { res.render('contact'); });
app.get('/about.html', (req, res) => { res.render('about'); });

//
app.get('/canada.html', (req, res) => { res.render('canada'); })
app.get('/usa.html', (req, res) => { res.render('usa'); })
app.get('/uk.html', (req, res) => { res.render('uk'); })
app.get('/dubai.html', (req, res) => { res.render('dubai'); })
app.get('/australia.html', (req, res) => { res.render('australia'); })
app.get('/singapore.html', (req, res) => { res.render('singapore'); })
app.get('/ireland.html', (req, res) => { res.render('ireland'); })
app.get('/newzealand.html', (req, res) => { res.render('newzealand');})

app.get('/france.html', (req, res) => { res.render('france'); })
app.get('/italy.html', (req, res) => { res.render('italy'); })
app.get('/germany.html', (req, res) => { res.render('germany'); })
app.get('/ba.html', (req, res) => { res.render('ba'); })
app.get('/bba.html', (req, res) => { res.render('bba'); })
app.get('/bca.html', (req, res) => { res.render('bca'); })
app.get('/mba.html', (req, res) => { res.render('mba'); })
app.get('/mca.html', (req, res) => { res.render('mca'); })
app.get('/ma.html', (req, res) => { res.render('ma'); })
app.get('/management.html', (req, res) => { res.render('management'); })
app.get('/medical.html', (req, res) => { res.render('medical'); })
app.get('/engineering.html', (req, res) => { res.render('engineering'); })
app.get('/architecture.html', (req, res) => { res.render('architecture'); })
app.get('/science.html', (req, res) => { res.render('science'); })
app.get('/law.html', (req, res) => { res.render('law'); })
app.get('/commerce.html', (req, res) => { res.render('commerce'); })
app.get('/arts.html', (req, res) => { res.render('arts'); })
app.post('/send-email', (req, res) => {
    const { name, email, phone, course } = req.body;

    // Create transporter
    let transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true, // Use SSL
        port: 465,
        logger:true,
        debug:true,
        secureConnection:true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: "rpresvgjbbkfujux"
        },
        tls:{
            rejectUnAuthorized:true
        }
    });

    let html_Content = `
    <h3>Name: ${name}</h3>
    <h3>Email: ${email}</h3>
    <h3>Phone: ${phone}</h3>
    <h3>Course: ${course}</h3>`;

    // Email data
    let mailOptions = {
        from: `${name} <${email}>`,
        to: 'director@study-spark.com',
        subject: 'New Request Form Submission',
        html: html_Content
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.json({ success: false, message: 'Sorry, something went wrong. Please try again later.' });
        } else {
            console.log('Email sent: ' + info.response);
            res.redirect('/?success=true#contact');
        }
    });
});

app.listen(PORT, () => { 
    console.log(`Server is running on PORT: http://localhost:${PORT}`); 
});