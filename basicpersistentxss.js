'use strict'

const express = require("express");
const fs = require("fs");

// Needed to parse the request body
const bodyParser = require("body-parser");
const app     = express();


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
	fs.readFile("comments.txt", function(error, data)
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
		pageStr += "	   <h1>What others have said:</h1><br>";
		pageStr += commentsData;
		pageStr += "	    <form action='/guestbook' method='post'>";
		pageStr += "        	    <label for='comment'>Message:</label>";
		pageStr += "	            <textarea id='comment' name='comment' placeholder='Whats on your mind?'></textarea><br><br>";
		pageStr += "        	    <input type='submit' value='Send message' />";
		pageStr += "	    </form>";
		pageStr += "	</body>";
		pageStr += "</html>	";
			
		// Send the page
		response.send(pageStr);	
	});
}


// Handles the sending of the index
app.get("/guestbook", function(req, res){
	
		
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
