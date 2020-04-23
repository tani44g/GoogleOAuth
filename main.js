const express = require('express');
const google = require('googleapis').google;
const jwt = require('jsonwebtoken');
const getstart = require('./getStartTime')
const getend = require('./getEndTime')
// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;
const bodyParser = require("body-parser");
// Including our config file
const CONFIG = require('./config');
// Creating our express application
const app = express();
// Allowing ourselves to use cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Setting up EJS Views
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(bodyParser.urlencoded({extended: true}));

// Listen on the port defined in the config file
app.listen(CONFIG.port, function () {
  console.log(`Listening on port ${CONFIG.port}`);
});

const oauth2Client = new OAuth2(CONFIG.oauth2Credentials.client_id, CONFIG.oauth2Credentials.client_secret, CONFIG.oauth2Credentials.redirect_uris[0]);

app.get('/', function (req, res) {
  // Obtain the google login link to which we'll send our users to give us access
  const loginLink = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Indicates that we need to be able to access data continously without the user constantly giving us consent
    scope: CONFIG.oauth2Credentials.scopes // Using the access scopes from our config file
  });
  return res.render("index", { loginLink: loginLink });
});

app.get('/home', function (req, res) {
  if (req.query.error) {
    // The user did not give us permission.
    return res.redirect('/');
  } else {
    //extracting the authorization code sent by google in URL and using it to get tokens
    oauth2Client.getToken(req.query.code, function(err, token) {
      if (err)
        return res.redirect('/');

      // Store the tokens given by google into a jsonwebtoken in a cookie called 'jwt'
      res.cookie('jwt',jwt.sign(token,CONFIG.JWTsecret));
      oauth2Client.setCredentials(token);
      return res.redirect('/get_some_data');
    });
  }
});

app.get('/get_some_data', function (req, res) {
  if (Object.keys(oauth2Client.credentials).length == 0) {
    // We haven't logged in
    return res.redirect('/');

  }
  
  // Get the calendar service
  const service = google.calendar({version:'v3',auth:oauth2Client});
  //get calendar events
  service.events.list({
    calendarId: 'primary',
    singleEvents: true,
    maxResults: 5,
    timeMin: (new Date()).toISOString(),
    orderBy: 'startTime',
  }).then(response => {
    return res.render('data',{events : response.data.items})
  })
});


app.post('/get_some_data',function(req,res){
  
  var startTime = getstart(req);
  var endTime = getend(req);
  
  var event = {
    summary: req.body.summary,
    location: req.body.location,
    description: req.body.description,
    start: {
      dateTime: startTime
    },
    end:{
      dateTime: endTime
    },
    attendees: [
      {'email': req.body.attendee1},
      {'email': req.body.attendee2},
    ],
  };
  if (!req.cookies.jwt) {
    // We haven't logged in
    return res.redirect('/');
  }
  // Create an OAuth2 client object from the credentials in our config file
  const oauth2Client = new OAuth2(CONFIG.oauth2Credentials.client_id, CONFIG.oauth2Credentials.client_secret, CONFIG.oauth2Credentials.redirect_uris[0]);
  // Add this specific user's credentials to our OAuth2 client
  oauth2Client.credentials = jwt.verify(req.cookies.jwt, CONFIG.JWTsecret);
  const calendar = google.calendar({version:'v3',auth : oauth2Client});
  //set calendar event
  calendar.events.insert({
    auth: oauth2Client,
    calendarId: 'primary',
    resource: event,
  }, function(err,event){
    if(err){
      console.log('THere is an error '+err);
      return;
    }
    
    return res.redirect(event.data.htmlLink);
    
  })
})
