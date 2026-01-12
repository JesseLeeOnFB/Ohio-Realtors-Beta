import { PDFDocument } from 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';

const CLIENT_ID = "865490150118-ti166sdlmjgqrcd552ttigauldt36ik5.apps.googleusercontent.com";
const API_KEY = "AIzaSyCkHCYkSmQvRE84DrwfPqwUrOGjpS_ItFs";

let gapiInited = false;
let authInstance;

function gapiLoaded() {
  gapi.load('client:auth2', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
  });

  authInstance = gapi.auth2.init({
    client_id: CLIENT_ID
  });

  document.getElementById('loginBtn').addEventListener('click', async () => {
    try {
      const user = await authInstance.signIn();
      document.getElementById('status').innerText = "Logged in as " + user.getBasicProfile().getName();
    } catch (err) {
      console.error("Login error:", err);
      alert("Google login failed. Check console for details.");
    }
  });
}

gapiLoaded();

// PDF Autofill
document.getElementById('fillBtn').addEventListener('click', async () => {
  const buyer = document.getElementById('buyerName').value;
  const seller = document.getElementById('sellerName').value;
  const address = document.getElementById('propertyAddress').value;
  const addendums = document.getElementById('addendums').value;

  if (!buyer || !seller || !address) {
    alert("Buyer, Seller, and Property Address are required.");
    return;
  }

  // Load your PDF template from assets folder
  const existingPdfBytes = await fetch('assets/sample-contract.pdf').then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  // Assuming the PDF fields are named "buyer", "seller", "address", "addendums"
  try {
    form.getTextField('buyer').setText(buyer);
    form.getTextField('seller').setText(seller);
    form.getTextField('address').setText(address);
    form.getTextField('addendums').setText(addendums);

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'filled_contract.pdf';
    link.click();
  } catch (err) {
    console.error("Error filling PDF fields:", err);
    alert("PDF field names must match template. Check console.");
  }
});
