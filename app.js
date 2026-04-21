let speechEnded = false;

function showFeedback(isCorrect) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.innerHTML = isCorrect ? '👍' : '👎';
}

function lockButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
}

function unlockButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.disabled = false);
}

function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('span');
        confetti.innerHTML = '🎉';
        confetti.style.position = 'absolute';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = Math.random() * 100 + 'vh';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Add event listener for speech end tracking
const speaker = new SpeechSynthesisUtterance();
speaker.onend = function() {
    speechEnded = true;
};