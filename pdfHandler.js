import { PDFDocument, rgb, StandardFonts } from 'https://cdn.jsdelivr.net/npm/pdf-lib@1.18.0/dist/pdf-lib.min.js';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(req){
  if(req.method === 'POST'){
    const formData = await req.formData();
    const pdfFile = formData.get('pdf');
    const buyerName = formData.get('buyerName');
    const sellerName = formData.get('sellerName');
    const property = formData.get('property');
    const addendums = formData.get('addendums');

    if(!pdfFile) return new Response('No PDF uploaded!', {status:400});

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    pages.forEach((page, i) => {
      const { width, height } = page.getSize();
      page.drawText(`Buyer: ${buyerName}`, { x:50, y:height-50, size:12, font, color:rgb(0,0,0) });
      page.drawText(`Seller: ${sellerName}`, { x:50, y:height-70, size:12, font, color:rgb(0,0,0) });
      page.drawText(`Property: ${property}`, { x:50, y:height-90, size:12, font, color:rgb(0,0,0) });
      if(addendums){
        page.drawText(`Addendums: ${addendums}`, { x:50, y:height-110, size:12, font, color:rgb(0,0,0) });
      }
    });

    const pdfBytes = await pdfDoc.save();
    return new Response(pdfBytes, {
      headers:{
        'Content-Type':'application/pdf',
        'Content-Disposition':'attachment; filename="FilledContract.pdf"'
      }
    });
  }

  return new Response('POST a PDF with form data', {status:400});
}
