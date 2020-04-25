'use strict'

const express = require("express");
// getting cookie parser -kev-
const cookieParser = require('cookie-parser');
const fs = require("fs");

// Needed to parse the request body
const bodyParser = require("body-parser");
const app     = express();

app.use(cookieParser());
// Needed to parse the request body
//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true }));


// Replaces all elements of the string
// @param src - the string on which to perform the replacement
// @param search - what to look for
// @param replacement - what to replace with
function replaceAll(src, search, replacement) {
    
  return src.replace(new RegExp(search, 'g'), replacement);
};

// Generates and sends the HTML page
// @param response - the response object to use for replying
function generateAndSendPage(response)
{
	// Read the comments file
	// @error - if there an error
	// @data - the data read
	fs.readFile("mostSecured.txt", function(error, data)
	{
		// If the read fails
		if(error) throw error;
		
		// The comments data
		let commentsData = "" + data;

		// Replace the newlines with HTML <br>
		commentsData = replaceAll(commentsData, "\n", "<br>");
		
		let pageStr = "	<!DOCTYPE html>";
		pageStr += "	<html>";
		pageStr += "	<head>";
		pageStr += "		<title>Guestbook </title>";
		pageStr += "	</head>";
		pageStr += "	<body bgcolor=white>";
		pageStr += "	   <h1>Please Login to continue:</h1><br>";
		pageStr += commentsData;
		pageStr += "	    <form action='/guestbook' method='post'>";
		pageStr += "        	    <label for='user'>Username:</label>";
		pageStr += "                <input type='text' name ='user></input>";
		pageStr += "                <label for='password'>password:</label>";
		pageStr += "                <input type='password' name='password'";
		pageStr += "	            <input type='submit' value='Authorize Login'>";
		pageStr += "	    </form>";
		pageStr += "	</body>";
		pageStr += "</html>	";
		

		// Send the page
		response.send(pageStr);	
	});
}


// Handles the sending of the index
app.get("/guestbook", function(req, res){
	
	//cooking the cookie
	let cookie = req.cookies.session_id;

	// no cookie lets assign one
	if (cookie === undefined){
		let randomNumber = Math.random().toString();
		randomNumber = randomNumber.substr(2,randomNumber.length);
		// expires in 300 seconds
		res.cookie('session_id',randomNumber, { expires: new Date(Date.now() + 3000000)});
		console.log('Cookie created: ' + randomNumber)
	}
	// cookie exist
	else{
		console.log('Cookie Exist: ', cookie);
	}
		
	// Generate the page
	generateAndSendPage(res);
		
});

// Handles the form
app.post("/guestbook", function(req, res) {
	
	// Save the data to to the comments file
	fs.appendFile("comments.txt", req.body.comment + "\n", function(error){
		
		// Error checks
		if(error) throw error;
		
		generateAndSendPage(res);
	
	});	

});

app.listen(3000);
