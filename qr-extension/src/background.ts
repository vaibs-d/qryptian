console.log('Background script is running');

chrome.runtime.onMessage.addListener((request: any, sender: chrome.runtime.MessageSender) => {
    console.log('Message received in background:', request);
    
    if (request.action === 'streamData') {
        console.log('User message captured:', request.data);
    } else if (request.action === 'test') {
        console.log('Test message received:', request.data);
    }
});