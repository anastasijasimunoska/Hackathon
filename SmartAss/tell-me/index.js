const chatView = document.querySelector(".chat-view");

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
let content = "";
    
recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
    .map(result => result[0].transcript)
    .join('');
    
    content = transcript;
});
    
const voiceButton = document.querySelector(".voice-button");
const stopButton = document.querySelector(".stop-button");

voiceButton.onclick = changeVoiceButtonActivity;
    
function changeVoiceButtonActivity() {
    const isActive = voiceButton.id === "active-voice-button";
    
    if(isActive) {
        voiceButton.id = "";
        recognition.removeEventListener('end', () => callSend);
    }
    
    else {
        voiceButton.id = "active-voice-button";
            
        recognition.start();
        recognition.addEventListener('end', callSend);
    }
}

function callSend() {
    send(false);
}

function send(isAssistant = false) {
    if(!isAssistant) {
        const noMessages = document.querySelector(".no-messages");
        if(noMessages) noMessages.remove();
    }
    
    if(voiceButton.id === "active-voice-button") changeVoiceButtonActivity();

    const messageTemplate = document.querySelector(".message-template");
    const messageElement = messageTemplate.content.cloneNode(true);

    if(isAssistant) {
        const messageElementAvatar = messageElement.querySelector(".user img");
        messageElementAvatar.src = "../images/logo.png";
    }
    
    const messageElementUsername = messageElement.querySelector(".user strong");
    
    if(!isAssistant) messageElementUsername.innerText = localStorage.getItem("username");
    else messageElementUsername.innerText = "Smart Assistent";
    
    const messageElementP = messageElement.querySelector("p");
    messageElementP.innerText = isAssistant ? isAssistant : content;

    if(!isAssistant) ask(content);
    chatView.appendChild(messageElement);

    if(isAssistant) {
        let speech = new SpeechSynthesisUtterance();
        speech.text = isAssistant;
        window.speechSynthesis.speak(speech);

        stopButton.onclick = () => { window.speechSynthesis.cancel(); }
    }
}

//https://urska.famnit.upr.si/api/generate

function ask(question) {
    const postData = {
        "model": "llama3",
        "prompt" : question,
        "stream": false
    }
      
    const jsonData = JSON.stringify(postData);
    const url = 'http://localhost:11434/api/generate';
    
    const xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
      
    xhr.onload = function() {
        if(xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText).response;
            send(response);
        }
    };
      
    xhr.onerror = function() {
    console.error('Request failed');
    };

    xhr.send(jsonData);
}