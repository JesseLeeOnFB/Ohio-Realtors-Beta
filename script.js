import { PDFDocument, rgb } from 'https://unpkg.com/pdf-lib/dist/pdf-lib.esm.js';

// Google Drive credentials
const CLIENT_ID = "865490150118-ti166sdlmjgqrcd552ttigauldt36ik5.apps.googleusercontent.com";
const API_KEY = "AIzaSyCkHCYkSmQvRE84DrwfPqwUrOGjpS_ItFs";

let gapiInited = false;
let uploadedFiles = []; // store uploaded PDFs

function gapiLoaded() {
  gapi.load('client:auth2', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
  });
  gapi.auth2.init({ client_id: CLIENT_ID });
  gapiInited = true;
  console.log("GAPI client initialized");
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const authInstance = gapi.auth2.getAuthInstance();
  await authInstance.signIn();
  document.getElementById('status').innerText = "Logged in! You can now upload PDFs.";
});

document.getElementById('uploadBtn').addEventListener('click', async () => {
  const files = document.getElementById('pdfInput').files;
  if (!files.length) return alert("Select PDF(s) first!");

  const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

  for (let file of files) {
    uploadedFiles.push(file); // keep in browser memory
    const metadata = { name: file.name, mimeType: file.type };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const res = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
      {
        method: "POST",
        headers: { "Authorization": "Bearer " + accessToken },
        body: form
      }
    );
    const data = await res.json();
    console.log("Uploaded:", file.name, "ID:", data.id);
  }
  document.getElementById('status').innerText = "PDF(s) uploaded to your Google Drive!";
});

// Fill PDFs in-browser
document.getElementById('fillBtn').addEventListener('click', async () => {
  const buyer = document.getElementById('buyerName').value;
  const seller = document.getElementById('sellerName').value;
  const address = document.getElementById('address').value;

  if (!uploadedFiles.length) return alert("Upload at least one PDF first!");

  for (let file of uploadedFiles) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    // Add text overlay (example positions, adjust to your template)
    firstPage.drawText(`Buyer: ${buyer}`, { x: 50, y: 700, size: 12, color: rgb(0,0,0) });
    firstPage.drawText(`Seller: ${seller}`, { x: 50, y: 680, size: 12, color: rgb(0,0,0) });
    firstPage.drawText(`Property: ${address}`, { x: 50, y: 660, size: 12, color: rgb(0,0,0) });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filled_${file.name}`;
    a.click();
  }
  document.getElementById('status').innerText = "PDF(s) filled and ready to download!";
});

gapiLoaded();
