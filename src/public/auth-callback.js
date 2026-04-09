// Get token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const error = urlParams.get('error');

// Decode JWT to show user info
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT decode error:', e);
    return null;
  }
}

// Copy token to clipboard
function copyToken() {
  const tokenValue = document.getElementById('tokenValue').innerText;
  navigator.clipboard.writeText(tokenValue).then(() => {
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = '✓ Copied!';
    setTimeout(() => btn.innerText = originalText, 2000);
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Handle error
  if (error) {
    document.querySelector('.spinner').style.display = 'none';
    document.querySelector('.status p').style.display = 'none';
    document.querySelector('.status h1').style.display = 'none';
    document.getElementById('errorMsg').style.display = 'block';
    document.getElementById('errorReason').innerText = `Error: ${decodeURIComponent(error)}`;
  }
  // Handle success
  else if (token) {
    const payload = decodeJWT(token);
    
    // Hide spinner
    document.querySelector('.spinner').style.display = 'none';
    document.querySelector('.status').style.display = 'none';
    
    // Show success
    document.getElementById('successMsg').style.display = 'block';
    document.getElementById('tokenSection').style.display = 'block';
    document.getElementById('nextSteps').style.display = 'block';
    document.getElementById('tokenValue').innerText = token;
    
    // If payload has user info, show it
    if (payload) {
      const heading = document.querySelector('.success h1');
      heading.innerHTML = `✓ Welcome, ${payload.email}!`;
    }
    
    // Store token in localStorage
    localStorage.setItem('authToken', token);
    console.log('✅ Token stored in localStorage');
    
    // If there's a frontend configured, show redirect info
    const clientUrl = 'http://localhost:3000'; // Common frontend URL
    if (clientUrl && clientUrl !== window.location.origin) {
      document.getElementById('redirectInfo').style.display = 'block';
      // You could redirect here if frontend is ready:
      // setTimeout(() => window.location.href = clientUrl + '/dashboard', 3000);
    }
  }
  // Neither error nor token
  else {
    document.querySelector('.spinner').style.display = 'none';
    document.querySelector('.status p').style.display = 'none';
    document.getElementById('errorMsg').style.display = 'block';
    document.getElementById('errorReason').innerText = 'No authentication token received. Please try logging in again.';
  }
});
