<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ohio Realtors Beta</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; font-family:Arial,sans-serif; background:#222; color:white; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; min-height:100vh; padding:20px; }
    h1 { text-align:center; }
    input, textarea, button { padding:10px; margin:5px 0; border-radius:5px; border:none; width:90%; max-width:400px; font-size:1em; }
    button { background:#28a745; color:white; cursor:pointer; }
    #status { margin-top:10px; }
  </style>
</head>
<body>

<h1>Ohio Realtors Beta</h1>

<!-- Google Sign-In -->
<div id="g_id_onload"
     data-client_id="865490150118-ti166sdlmjgqrcd552ttigauldt36ik5.apps.googleusercontent.com"
     data-callback="handleCredentialResponse"
     data-auto_prompt="false"
     data-login_uri="https://jesseleeonfb.github.io/Ohio-Realtors-Beta/">
</div>
<div class="g_id_signin" data-type="standard"></div>

<!-- Input fields -->
<input type="text" id="buyerName" placeholder="Buyer Name">
<input type="text" id="sellerName" placeholder="Seller Name">
<input type="text" id="propertyAddress" placeholder="Property Address">
<textarea id="addendums" placeholder="Addendums / Notes" rows="3"></textarea>

<!-- PDF Upload -->
<input type="file" id="pdfUpload" multiple accept="application/pdf">

<button id="fillBtn" disabled>Fill & Download PDFs</button>
<div id="status"></div>

<script src="https://accounts.google.com/gsi/client" async defer></script>
<script type="module" src="script.js"></script>

</body>
</html>
