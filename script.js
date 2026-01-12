// Use your credentials
const CLIENT_ID = "865490150118-ti166sdlmjgqrcd552ttigauldt36ik5.apps.googleusercontent.com";
const API_KEY = "AIzaSyCkHCYkSmQvRE84DrwfPqwUrOGjpS_ItFs";

function gapiLoaded() {
  gapi.load('client:auth2', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
  });
  gapi.auth2.init({ client_id: CLIENT_ID });
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

// Load gapi
gapiLoaded();
