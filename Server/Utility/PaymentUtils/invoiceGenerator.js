import puppeteer from 'puppeteer';
export const createInvoice = async (data, payment,testName) => {
    const browser = await puppeteer.launch({   
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 0
      });
    const page = await browser.newPage();
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Invoice - Attainment</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  text-align: center;
                  padding-bottom: 20px;
                  border-bottom: 1px solid #eeeeee;
              }
              .content {
                  padding: 20px 0;
              }
              .invoice-box {
                  background-color: #f9f9f9;
                  border: 1px solid #eeeeee;
                  border-radius: 5px;
                  padding: 20px;
                  margin: 20px 0;
              }
              .invoice-detail {
                  display: flex;
                  justify-content: space-between;
                  padding: 8px 0;
                  border-bottom: 1px solid #eeeeee;
              }
              .invoice-detail:last-child {
                  border-bottom: none;
              }
              .total {
                  font-weight: bold;
                  font-size: 18px;
                  margin-top: 10px;
                  padding-top: 10px;
                  border-top: 2px solid #dddddd;
              }
              .course-item {
                  padding: 8px 0;
                  border-bottom: 1px solid #eeeeee;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>Invoice</h1>
          </div>
          
          <div class="content">
              <div class="invoice-box">
                  <div class="invoice-detail">
                      <span>Customer:</span>
                      <span>${data.fullName}</span>
                  </div>
                  
                  <div class="invoice-detail">
                      <span>Email:</span>
                      <span>${data.email}</span>
                  </div>
                  
                  <div class="invoice-detail">
                      <spanTests(s):</span>
                      <span></span>
                  </div>
                  
                  ${testName
                    .map(
                      item => `
                  <div class="course-item">
                      <span>${item}</span>
                  </div>
                  `
                    )
                    .join('')}
                  
                  <div class="invoice-detail">
                      <span>Invoice ID:</span>
                      <span>${data.receipt}</span>
                  </div>
                  
                  <div class="invoice-detail">
                      <span>Date:</span>
                      <span>${new Date().toLocaleDateString()}</span>
                  </div>
                  
                  <div class="invoice-detail">
                      <span>Payment Method:</span>
                      <span>${payment.paymentMethod}</span>
                  </div>
                  
                  <div class="invoice-detail total">
                      <span>Total Amount:</span>
                      <span>₹${payment.amount}</span>
                  </div>
              </div>
          </div>
      </body>
      </html>`;
  
    // Set page content and generate PDF
    await page.setContent(htmlContent, { waitUntil: 'load' });
    // await page.setContent(htmlContent, {  waitUntil: 'domcontentloaded' ,timeout: 0});
    const pdfBuffer = await page.pdf({
        format: 'A4'
      });
    console.log("PDF generated");
    await browser.close();
    console.log('PDF generated successfully');
    return pdfBuffer;
  };