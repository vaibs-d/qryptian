console.log('Qryptian: Content script has loaded!');

let lastDetectedInput = null;
let lastRedactedText = null;

// Create modal HTML with updated styling
const modalHTML = `
  <div id="qryptianModal" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5); font-family: 'Arial', sans-serif;">
    <div style="background-color:#ffffff; margin:15% auto; padding:30px; border-radius:15px; width:350px; text-align:center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="background-color:#4a0e4e; border-radius:50%; width:60px; height:60px; margin:0 auto 20px; display:flex; justify-content:center; align-items:center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
      </div>
      <h2 style="color:#4a0e4e; margin-bottom:15px;">Qryptian Alert</h2>
      <p style="color:#333; margin-bottom:20px;">Sensitive data detected. Would you like to redact it?</p>
      <button id="qryptianRedactButton" style="background-color:#4a0e4e; color:white; border:none; padding:10px 20px; margin:5px; border-radius:5px; cursor:pointer; transition: background-color 0.3s;">Redact Text</button>
      <button id="qryptianCancelButton" style="background-color:#f0f0f0; color:#333; border:none; padding:10px 20px; margin:5px; border-radius:5px; cursor:pointer; transition: background-color 0.3s;">Cancel</button>
    </div>
  </div>
`;

// Inject modal into page
document.body.insertAdjacentHTML('beforeend', modalHTML);

const modal = document.getElementById('qryptianModal');
const redactButton = document.getElementById('qryptianRedactButton');
const cancelButton = document.getElementById('qryptianCancelButton');

// Add hover effects
redactButton.addEventListener('mouseover', function() {
  this.style.backgroundColor = '#6a2a6e';
});
redactButton.addEventListener('mouseout', function() {
  this.style.backgroundColor = '#4a0e4e';
});

cancelButton.addEventListener('mouseover', function() {
  this.style.backgroundColor = '#e0e0e0';
});
cancelButton.addEventListener('mouseout', function() {
  this.style.backgroundColor = '#f0f0f0';
});

redactButton.addEventListener('click', function() {
  if (lastDetectedInput && lastRedactedText) {
    lastDetectedInput.value = lastRedactedText;
    lastDetectedInput.dispatchEvent(new Event('input', { bubbles: true }));
    lastDetectedInput = null;
    lastRedactedText = null;
  }
  modal.style.display = 'none';
});

cancelButton.addEventListener('click', function() {
  modal.style.display = 'none';
});

async function sendToRedactionAPI(text) {
  console.log('Sending to redaction API:', text);
  try {
    const response = await fetch('http://localhost:8000/redact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received from redaction API:', data.redacted_text);
    return data.redacted_text;
  } catch (error) {
    console.error('Error calling redaction API:', error);
    return text; // Return original text if API call fails
  }
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

async function checkAndHandleSensitiveData(target) {
  const value = target.value;
  
  console.log('Checking for sensitive data:', value);

  // Check if the text has already been redacted
  if (value.includes('*')) {
    console.log('Text already contains redactions, skipping check');
    return;
  }
  
  const redactedText = await sendToRedactionAPI(value);
  
  if (redactedText !== value) {
    console.log('Sensitive data detected, showing modal to the user');
    lastDetectedInput = target;
    lastRedactedText = redactedText;
    modal.style.display = 'block';
  } else {
    console.log('No sensitive data detected');
  }

  console.log(`User input in ${target.tagName} on ${window.location.href}:`);
  console.log(`Original: ${value}`);
  console.log(`Redacted: ${redactedText}`);
}

const debouncedCheck = debounce(checkAndHandleSensitiveData, 400);

function handleInputEvent(e) {
  const target = e.target;
  if ((target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target.type !== 'password') {
    console.log('Input event detected, scheduling check');
    debouncedCheck(target);
  }
}

document.addEventListener('input', handleInputEvent);
document.addEventListener('paste', handleInputEvent);

console.log('Qryptian: Content script fully loaded and event listeners attached');