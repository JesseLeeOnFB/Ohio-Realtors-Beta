import { PDFDocument } from 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';

const apiKey = "AIzaSyCSboJdzETN2mIDzmErQHbN_gpkJt-vKoI";

// Google login callback
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    document.getElementById('status').innerText = "Logged in!";
}

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

    const files = document.getElementById('pdfUpload').files;
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

            // Fill text fields — make sure your PDF fields match these names
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

    document.getElementById('status').innerText = "All PDFs filled and downloaded!";
});
