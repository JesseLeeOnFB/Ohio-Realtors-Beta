// Show status messages
const status = document.getElementById('status');
const pdfForm = document.getElementById('pdfForm');

document.getElementById('loginBtn').addEventListener('click', () => {
  // Redirect to Cloudflare worker for Google login
  window.location.href = '/login';
});

// Check URL params for OAuth code
const params = new URLSearchParams(window.location.search);
if(params.get('code')){
  status.textContent = 'Google signed in!';
  pdfForm.style.display = 'block';
}

// Handle PDF form submission
pdfForm.addEventListener('submit', async e => {
  e.preventDefault();
  
  const pdfInput = document.getElementById('pdfInput').files[0];
  const buyerName = document.getElementById('buyerName').value;
  const sellerName = document.getElementById('sellerName').value;
  const property = document.getElementById('property').value;
  const addendums = document.getElementById('addendums').value;

  if(!pdfInput){
    status.textContent = 'Select a PDF first!';
    return;
  }

  status.textContent = 'Processing PDF...';

  const formData = new FormData();
  formData.append('pdf', pdfInput);
  formData.append('buyerName', buyerName);
  formData.append('sellerName', sellerName);
  formData.append('property', property);
  formData.append('addendums', addendums);

  try{
    const res = await fetch('/pdfHandler', { method:'POST', body:formData });
    if(res.ok){
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'FilledContract.pdf';
      link.click();
      URL.revokeObjectURL(url);
      status.textContent = 'PDF ready for download!';
    } else {
      const text = await res.text();
      status.textContent = `Error: ${text}`;
    }
  }catch(err){
    status.textContent = `Error: ${err}`;
  }
});
