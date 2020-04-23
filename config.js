const port = process.env.PORT || 5000;
const keys = require('./oauth2.keys.json')
const web = keys.web;
const baseURL = keys.web.javascript_origins;
module.exports = {
  // The secret for the encryption of the jsonwebtoken
  JWTsecret: 'mysecret',
  baseURL: baseURL,
  port: port,
  // The credentials and information for OAuth2
  oauth2Credentials: {
    client_id: web.client_id,
    project_id: web.project_id, // The name of your project
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: web.client_secret,
    redirect_uris: [
      `${baseURL}/home`
    ],
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.readonly' 
    ]
  }
};