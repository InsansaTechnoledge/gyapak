import { CLIENT_BASE_URL_LIVE } from "../../../config/env.js";

export const generatePaymentEmailTemplate = (
    data,
    testName,
    payment
  ) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Purchase Confirmation - TestSeries</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f5f7fa;
              }
              .container {
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
                  padding: 25px;
              }
              .header {
                  text-align: center;
                  padding-bottom: 20px;
                  border-bottom: 1px solid #eeeeee;
              }
              .logo {
                  max-width: 180px;
                  margin-bottom: 15px;
              }
              .success-icon {
                  width: 80px;
                  height: 80px;
                  margin: 10px auto 20px;
                  display: block;
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
              .button {
                  display: inline-block;
                  background-color: #4CAF50;
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 4px;
                  font-weight: bold;
                  margin: 20px 0;
              }
              .button:hover {
                  background-color: #45a049;
              }
              .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777777;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #eeeeee;
              }
              .course-banner {
                  width: 100%;
                  height: auto;
                  border-radius: 4px;
                  margin: 15px 0;
              }
              .feature-item {
                  display: flex;
                  align-items: center;
                  margin: 10px 0;
              }
              .feature-icon {
                  width: 20px;
                  height: 20px;
                  margin-right: 10px;
              }
              .social-icons {
                  margin-top: 15px;
              }
              .social-icon {
                  display: inline-block;
                  width: 30px;
                  height: 30px;
                  margin: 0 5px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="/api/placeholder/180/60" alt="TestSeries Logo" class="logo">
                  <h1>Thank You for Your Purchase!</h1>
                  <img src="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" class="success-icon" alt="Success">
                  <!-- Note: The actual checkmark GIF would be an actual URL to a hosted GIF -->
                  <img src="/api/placeholder/80/80" class="success-icon animate__animated animate__bounceIn" alt="Success Check">
              </div>
              
              <div class="content">
                  <p>Dear <strong>${data.fullName}</strong>,</p>
                  
                  <p>Great news! Your purchase was successful. Welcome to <strong>${testName}</strong>. We're excited to have you join our learning community.</p>
                  
                  <img src="/api/placeholder/540/200" class="course-banner" alt="${testName} Banner">
                  
                  <p>You now have full access to all course materials. Get started right away by clicking the button below:</p>
                  
                  <div style="text-align: center;">
                      <a href="${CLIENT_BASE_URL_LIVE}/" class="button">Access Your TestSeries</a>
                  </div>
                  
                  <div class="feature-list">
                      <h3>What's included in your purchase:</h3>
                      <div class="feature-item">
                          <img src="/api/placeholder/20/20" class="feature-icon" alt="Video">
                          <span>Full access to all Tests</span>
                      </div>
                      <div class="feature-item">
                          <img src="/api/placeholder/20/20" class="feature-icon" alt="Document">
                          <span>Downloadable resources and materials</span>
                      </div>
                      <div class="feature-item">
                          <img src="/api/placeholder/20/20" class="feature-icon" alt="Support">
                          <span>24/7 Support from our team</span>
                      </div>
                  </div>
                  
                  <div class="invoice-box">
                      <h2>Invoice #${data.receipt}</h2>
                      <p>Date: ${new Date().toLocaleDateString()}</p>
                      
                      <div class="invoice-detail">
                          <span>Course:</span>
                          <span>${testName}</span>
                      </div>
                      
                      <div class="invoice-detail">
                          <span>Subtotal:</span>
                          <span>₹${payment.finalTotal}</span>
                      </div>                      
                      
                      <div class="invoice-detail total">
                          <span>Total:</span>
                          <span>₹${payment.amount}</span>
                      </div>
                      
                      <p style="margin-top: 20px; font-size: 14px;">Payment method: ${payment.paymentMethod}</p>
                  </div>
                  
                  <p>If you have any questions about your purchase or need assistance with your Tests, please don't hesitate to contact our support team at <a href="mailto:queries@insansa.com">queries@insansa.com</a>.</p>
                  
                  <p>Happy learning!</p>
                  
                  <p>Best regards,<br>The Gyapak-TestSeries Team</p>
              </div>
              
              <div class="footer">
                  <div class="social-icons">
                      <a href="https://facebook.com/attainment"><img src="/api/placeholder/30/30" class="social-icon" alt="Facebook"></a>
                      <a href="https://twitter.com/attainment"><img src="/api/placeholder/30/30" class="social-icon" alt="Twitter"></a>
                      <a href="https://instagram.com/attainment"><img src="/api/placeholder/30/30" class="social-icon" alt="Instagram"></a>
                      <a href="https://linkedin.com/company/attainment"><img src="/api/placeholder/30/30" class="social-icon" alt="LinkedIn"></a>
                  </div>
                  <p>© 2025 TestSeries. All rights reserved.</p>
                  <p>Insansa Techknoledge</p>
                  <p>
                      <a href="https://insansa.com/privacy-policy">Privacy Policy</a> | 
                      <a href="https://insansa.com/terms">Terms of Service</a> | 
                      <a href="https://gyapak.in/unsubscribe?email=${data.email}">Unsubscribe</a>
                  </p>
              </div>
          </div>
      </body>
      </html>
      `;
  };
  