/**
 * Handles the chatbot UI interactions and communications wiht the backend
 * Displays the user and both messages
 * Sends messages to OpenAI backend through fetch
 */

//Button element that sends the user's chat message
var sendBtn = document.getElementById('sendBtn');

//The text input where the user types their message
var textbox = document.getElementById('textbox');

//Container that displays all the chat messages
var chatContainer = document.getElementById('chatContainer');

/**
 * Displays the user's message in the chat container
 * @param {*} userMessage 
 */
function sendMessage(userMessage) {
    //Creating a new div element for the user's message
    var messageElement = document.createElement('div');

    //Assign the class name for this variable for styling
    messageElement.className = "user-message";

    //Setting the HTML content to "You:" to indicate the messages sent my the user
    messageElement.innerHTML = "<span>You: </span>" + 
                                "<span>" + userMessage + "</span>";

    //Appending the user message to the chat container
    chatContainer.appendChild(messageElement);

    //Scrolling automatically to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Sends the user's message to the backend and takes care of the response of the chatbot
 * @param {*} userMessage 
 */
async function chatbotResponse(userMessage) {
    try {
        //Creating a loading indicator while waiting for the bot's response
        const loadingElement = document.createElement('div');
        loadingElement.className = "bot-message";
        loadingElement.innerHTML = "<span><strong>Chatbot: </strong></span><span>Thinking...</span>";

        //Adding the loading message to the chat container
        chatContainer.appendChild(loadingElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        //Sending a POST request to the backend with the user's message
        const response = await fetch('/chat', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({message:userMessage})
        });

        //Parsing the response as JSON
        const data = await response.json();

        //Removing the loading message once the response is received
        chatContainer.removeChild(loadingElement);

        //Creating a new div to hold the chatbot's response
        const messageElement = document.createElement('div');

        //Adding "chatbot:" and then the response
        messageElement.innerHTML = "<span>Chatbot: </span>" + "<span>" + data.response + "</span>";

        //Appending the chatbot's message to the chat container
        chatContainer.appendChild(messageElement);

        //Scrolling to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    catch (err) {
        //Log error in console for the purpose of debugging
        console.error("Error fetching chatbot response", err);

        //Displays a error message in the UI
        const errorElement = document.createElement('div');
        errorElement.innerHTML = "<span><strong>Error: </strong></span>" + 
                                "<span>Failed to get a response. Please try again.</span>";

        chatContainer.appendChild(errorElement);
        
        // Auto-scroll to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}



/**
 * Event listener for the send button
 * Validates and sends message from the textbox to the chat container
 * Calls the sendMessage and chatbotResponse functions here to add the user's and chatbot's message to the chat container
 */
sendBtn.addEventListener('click', function(e) {
    //Gets the message typed b y hte user
    var userMessage = textbox.value;

    //If the message is empty or just whitespace, an alert is displayed
    if (userMessage.trim() == "") {
        alert("Please type a message");
    }
    else {
        //Trim the message and update the user object
        let userMessageText = userMessage.trim();

        //Shows the user's message in the chat
        sendMessage(userMessageText);

        //Sends the message to the chatbot to get a response
        chatbotResponse(userMessageText);

        //Clears the textbox after the response is received so the user can type another question
        textbox.value = "";
    }
});