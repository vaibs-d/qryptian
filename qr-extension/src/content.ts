console.log('Content script is running on:', window.location.href);

let lastMessage = '';

function findUserMessages() {
    const messages = document.querySelectorAll('.font-user-message p');
    if (messages.length > 0) {
        const lastUserMessage = messages[messages.length - 1];
        const messageText = lastUserMessage.textContent?.trim() || '';
        if (messageText !== lastMessage) {
            lastMessage = messageText;
            sendMessageToBackground(lastMessage);
        }
    }
}

function sendMessageToBackground(message: string) {
    chrome.runtime.sendMessage({action: 'streamData', data: message}, () => {
        if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError.message);
        } else {
            console.log('Message sent successfully:', message);
        }
    });
}

setInterval(findUserMessages, 1000);

const observer = new MutationObserver(() => {
    findUserMessages();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Test message
chrome.runtime.sendMessage({action: 'test', data: 'Hello from content script'});
console.log('Test message sent');