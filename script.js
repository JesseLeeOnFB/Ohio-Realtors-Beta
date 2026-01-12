// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes } 
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCJyO1S8WQqnfjl2JC8aE63fd_q2RDS3fw",
  authDomain: "ohio-realtors-beta.firebaseapp.com",
  projectId: "ohio-realtors-beta",
  storageBucket: "ohio-realtors-beta.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// HTML Elements
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const authStatus = document.getElementById("authStatus");
const authDiv = document.getElementById("authDiv");
const appDiv = document.getElementById("appDiv");
const uploadBtn = document.getElementById("uploadBtn");
const pdfUpload = document.getElementById("pdfUpload");
const uploadStatus = document.getElementById("uploadStatus");

// Register
registerBtn.addEventListener("click", () => {
  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then(userCredential => {
      authDiv.style.display = "none";
      appDiv.style.display = "block";
      authStatus.innerText = "";
    })
    .catch(err => authStatus.innerText = err.message);
});

// Login
loginBtn.addEventListener("click", () => {
  signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then(userCredential => {
      authDiv.style.display = "none";
      appDiv.style.display = "block";
      authStatus.innerText = "";
    })
    .catch(err => authStatus.innerText = err.message);
});

// Upload PDFs
uploadBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("Log in first");
  const files = pdfUpload.files;
  for (let file of files) {
    const fileRef = storageRef(storage, `${user.uid}/${file.name}`);
    await uploadBytes(fileRef, file);
  }
  uploadStatus.innerText = "Templates uploaded!";
});
