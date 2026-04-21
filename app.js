// speech.js

const speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// Speech ended tracking
function handleSpeechEnd() {
    console.log('Speech has ended');
}

// Feedback icons
const feedbackIcons = document.querySelectorAll('.feedback-icon');
feedbackIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        // Add feedback logic here
    });
});

// Locked buttons while speaking
function lockButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
}

function unlockButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.disabled = false);
}

speechRecognition.onstart = lockButtons;
speechRecognition.onend = function() {
    unlockButtons();
    handleSpeechEnd();
};

// Confetti animation
function showConfetti() {
    // Implementation of confetti animation can be added here
}

// Call showConfetti() at the end of the game

// Other game logic here...