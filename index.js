//Importing required packages
const express = require("express");

//loads environmental variables from a file named .env into process.env
require("dotenv").config();

var ejs = require('ejs');

//creating an express app instance and store it in the variable 'app
var app = express();

//Serving static files like CSS, JS, images from the public folder
app.use(express.static("public"));

app.set('view engine', 'ejs');



app.get('/', (req, res) => {
    res.render('index');
});


//Importing the OpenAI
const OpenAI = require("openai");

//Creates an instance of OpenAI API client using API key from the environmental variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


//Setting the server port
const port = 4000; 

//Starting the server to run on localhost:4000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

 //POST endpoint to handle chatbot messages from the frontend
 app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log("Received message:", userMessage);

    try {
        //Calls the OpenAI API to get a chat completion using the user's message
        const completion = await openai.chat.completions.create ({
            //specifies the model of AI to use
            model: "gpt-3.5-turbo", 
            //Starts the array of messages that are sent to the model
            messages: [
                //Sends the user's message to the model of AI
                { role:"user", content: userMessage }
            ]
        });

        //Extracts the chatbot's reply from the response
        const botResponse = completion.choices[0].message.content.trim();

        //Sends the chatbot's response back to the frontend in JSON
        res.json({response: botResponse});
    }
    catch (error) {
        console.error("OpenAI API error:", error);
        res.status(500).json({
            error: "Failed to fetch the response"
        });
    }

});


