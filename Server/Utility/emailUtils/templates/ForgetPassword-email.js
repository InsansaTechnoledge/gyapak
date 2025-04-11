export const generateForgotPasswordEmailTemplate = (data, resetLink) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Attainment</title>
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
              .content {
                  padding: 20px 0;
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
                  <h1>Password Reset Request</h1>
              </div>
  
              <div class="content">
                  <p>Hi <strong>${data.fullName}</strong>,</p>
  
                  <p>We received a request to reset your password for your TestSeries account. If you made this request, you can reset your password by clicking the button below:</p>
  
                  <div style="text-align: center;">
                      <a href="${resetLink}" class="button">Reset Password</a>
                  </div>
  
                  <p>This link will expire in 30 minutes for your security.</p>
  
                  <p>If you didn’t request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
  
                  <p>If you have any issues, please contact us at <a href="mailto:queries@insansa.com">queries@insansa.com</a>.</p>
  
                  <p>Stay secure,<br>The Gyapak TestSeries Team</p>
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
  