import { PDFDocument } from 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';

const fillBtn = document.getElementById('fillBtn');
const status = document.getElementById('status');

// Enable button only if logged in
window.onload = () => {
    if (localStorage.getItem('loggedIn') === 'true') {
        status.innerText = "Already logged in!";
        fillBtn.disabled = false;
    }
};

// Google Login callback
window.handleCredentialResponse = (response) => {
    console.log("Google ID token:", response.credential);
    localStorage.setItem('loggedIn', 'true');
    status.innerText = "Logged in!";
    fillBtn.disabled = false;
};

// Fill PDFs
fillBtn.addEventListener('click', async () => {
    const buyer = document.getElementById('buyerName').value;
    const seller = document.getElementById('sellerName').value;
    const address = document.getElementById('propertyAddress').value;
    const addendums = document.getElementById('addendums').value;
    const files = document.getElementById('pdfUpload').files;

    if (!buyer || !seller || !address) {
        alert("Buyer, Seller, and Property Address are required.");
        return;
    }

    if (!files.length) {
        alert("Please upload at least one broker PDF.");
        return;
    }

    for (let i = 0; i < files.length; i++) {
        try {
            const file = files[i];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const form = pdfDoc.getForm();

            // Fill fields - make sure PDF fields match these names
            try { form.getTextField('buyer').setText(buyer); } catch {}
            try { form.getTextField('seller').setText(seller); } catch {}
            try { form.getTextField('address').setText(address); } catch {}
            try { form.getTextField('addendums').setText(addendums); } catch {}

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'filled_' + file.name;
            link.click();

        } catch (err) {
            console.error("Error processing PDF:", err);
            alert("Error filling " + files[i].name + ". Check console.");
        }
    }

    status.innerText = "All PDFs filled and downloaded!";
});
