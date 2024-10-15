document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleBtn') as HTMLButtonElement;
    const statusSpan = document.getElementById('status') as HTMLSpanElement;
  
    function updateUI(isStreaming: boolean): void {
      statusSpan.textContent = isStreaming ? 'Active' : 'Inactive';
      toggleBtn.textContent = isStreaming ? 'Stop Streaming' : 'Start Streaming';
    }
  
    chrome.runtime.sendMessage({action: 'getStatus'}, function(response: {isStreaming: boolean}) {
      updateUI(response.isStreaming);
    });
  
    toggleBtn.addEventListener('click', function() {
      chrome.runtime.sendMessage({action: 'toggleStreaming'}, function(response: {isStreaming: boolean}) {
        updateUI(response.isStreaming);
      });
    });
  });
  