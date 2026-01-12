import { PDFDocument } from 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';

const fillBtn = document.getElementById('fillBtn');
const pdfUpload = document.getElementById('pdfUpload');
const status = document.getElementById('status');

let pdfFiles = [];

// --- Google Login callback ---
window.handleCredentialResponse = (response) => {
    localStorage.setItem('loggedIn', 'true');
    status.innerText = "Logged in!";
    fillBtn.disabled = false;
};

// --- Persist login ---
window.onload = () => {
    if(localStorage.getItem('loggedIn') === 'true'){
        status.innerText = "Already logged in!";
        fillBtn.disabled = false;
    }
}

// --- File input ---
pdfUpload.addEventListener('change', (e) => {
    pdfFiles = Array.from(e.target.files);
    status.innerText = `${pdfFiles.length} file(s) added.`;
});

// --- Fill PDFs ---
fillBtn.addEventListener('click', async () => {
    if(!pdfFiles.length) {
        alert("Upload at least one PDF.");
        return;
    }

    const buyer = document.getElementById('buyerName').value;
    const seller = document.getElementById('sellerName').value;
    const address = document.getElementById('propertyAddress').value;
    const addendums = document.getElementById('addendums').value;

    for(const file of pdfFiles){
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        pdfDoc.getPages().forEach(page => {
            page.drawText(`Buyer: ${buyer}`, { x:50, y:700, size:12 });
            page.drawText(`Seller: ${seller}`, { x:50, y:680, size:12 });
            page.drawText(`Address: ${address}`, { x:50, y:660, size:12 });
            if(addendums) page.drawText(`Addendums: ${addendums}`, { x:50, y:640, size:12 });
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type:'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `filled_${file.name}`;
        a.click();
    }

    status.innerText = `Filled ${pdfFiles.length} PDF(s)`;
    pdfFiles = [];
});
