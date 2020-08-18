const nodemailer = require('nodemailer')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('express-flash-messages')
const dotenv = require('dotenv').config()

const { dirname } = require('path')
const port = 3000
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const { check, validationResult } = require('express-validator');
//MIDDLEWARE SETUP
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser('secret'))
app.use(session({cookie: {maxAge: 10000}}))
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/node_modules/mdbootstrap/css'));
app.use('/js', express.static(__dirname + '/node_modules/mdbootstrap/js'));
app.use(express.static('public'));



// HTML VIEWS
const handlebars = require('express3-handlebars').create()
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

// FLASH SETUP
//The app.locals object has properties that are local variables within the application.


app.use((req, res, next) => {
  res.locals.message = req.session.message
  delete req.session.message//doesnt get stored page refresh
  next()
})

// LISTEN TO SERVER
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


// HBS ROUTES TO VIEW 
app.get('/', function (req, res) {
  res.render('home');

});
app.get('/contact', function (req, res) {
  req.session.errors = null;
  res.render('contact');
});
app.get('/portfolio', function (req, res) {
  res.render('portfolio');
});


// CREDS FOR NODDEMAILER SENDING EMAIL
const GMAIL_USER= process.env.GMAIL_USER
const GMAIL_PASS=process.env.GMAIL_PASS

const validation = [
  check('name')
      .not()
      .isEmpty()
      .withMessage('Name is required'),
  check('email', 'Email is required')
      .isEmail(),
      check('name')
      .not()
      .isEmpty()
      .withMessage('Name is required')
]


//POST ROUTE FOR CONTACT FORM
app.post('/contact', (req, res) => {

  errorMessage = { 
    type: 'danger',
    intro: 'empty fields',
    message: 'Please complete all fields'
}
successMessage = { 
  type: 'success',
  intro: 'messgae sent',
  message: 'Please complete all fields'
}
  if(req.body.name == "" || req.body.email == "" || req.body.subject == "" || req.body.message == "")
  {
    req.session.message = errorMessage
    res.redirect('/')
  } else {
    req.session.message = successMessage
  }
  console.log("tst")
  res.redirect('/contact')
  //   const displaymessage = {
  //   type: 'danger',
  //   intro: 'Hold up! Wait!',
  //   message: "Empty Fields Cannot be blank!"
  // }
  
  //   req.session.message = displaymessage;

  //   res.redirect('/in')
  // }
  // else
  // {
  //   const displaymessagesuccess = {
  //     type: 'success',
  //     intro: 'Great!',
  //     message: "Your message was sent successfully"
  //   }
  //   req.session.message = displaymessagesuccess
  //   res.redirect('/contact')
  //   }


    // SEND MAIL CONFIG NODEMAILER
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS

    }
  })

  const mailOptions = {
    from: req.body.email,
    to: GMAIL_USER,
    subject: 'Sending Email using Node.js',
    text: `message from ${req.body.email} says: " ${req.body.message} "`
  };

  const sentOrNot = function (err, succ) {
    console.log(mailOptions)
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + succ.mailOptions);
      // res.redirect('/contact.html')


    }
  }

  transporter.sendMail(mailOptions, sentOrNot)
  // MESSAGE SENT MESSAGE HERE??
  

  // res.redirect('/contact.html')

})