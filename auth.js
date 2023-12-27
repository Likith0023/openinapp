const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// Load credentials from the downloaded JSON file
const credentials = require('./credentials.json');

// Set up OAuth2 client
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Generate an authentication URL
const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.modify'], // Adjust scope based on your requirements
});

console.log('Authorize this app by visiting:', authUrl);

// Create an interface to read tokens from the user
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Get authorization code from user
rl.question('Enter the code from the authorization page:', async (code) => {
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        console.log('Tokens obtained:', tokens);
        // Save tokens to a file for future use if needed
        fs.writeFileSync('./tokens.json', JSON.stringify(tokens));
    } catch (error) {
        console.error('Error retrieving access token:', error);
    } finally {
        rl.close();
    }
});
