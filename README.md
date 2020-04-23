# GoogleOAuth & Calendar API integration
The webpage appears at URL localhost:5000/ with a login button
On clicking it a URL is generated that takes the user to google consent page where the user is asked for permissions
  * if denied - redirects to the home page
  * if granted - redirects to /home page where the authorization code is extracted and with use of it the access token provided is fetched
    - after that it is redirected to /get_some_data page
    
On this page:
* The 10 upcoming events are shown in json format
* Next option is to create an event and send invite to two attendees (taken 2 here just for sample case)
* The fields are:
  - title of event
  - location
  - description
  - **Start Time** - to notify the start date & time of event --- format **YYYY-MM-DD**
    i. for time - format **HH:MM**
  - **End Time** - to notify the end of event --- same format
  - attendee 1 email
  - attendee 2 email

On submitting the app redirects to your calendar app showing the event created.
 
