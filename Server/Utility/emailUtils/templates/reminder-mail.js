export const generateMockTestReminderEmailTemplate = (data) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Mock Test Reminder</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f7fa;
                  padding: 20px;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
              }
              .container {
                  background-color: #ffffff;
                  padding: 25px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
              }
              .header {
                  text-align: center;
                  padding-bottom: 15px;
                  border-bottom: 1px solid #eeeeee;
              }
              .logo {
                  max-width: 180px;
                  margin-bottom: 10px;
              }
              .content {
                  padding: 20px 0;
              }
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #28a745;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777777;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #eeeeee;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="/api/placeholder/180/60" class="logo" alt="TestSeries Logo" />
                  <h2>🕒 Reminder: Upcoming Mock Test</h2>
              </div>
  
              <div class="content">
                  <p>Hi <strong>${data.fullName}</strong>,</p>
  
                  <p>This is a friendly reminder that your mock test <strong>“${data.testName}”</strong> is scheduled for:</p>
  
                  <p><strong>📅 Date:</strong> ${data.testDate}<br/>
                     <strong>⏰ Time:</strong> ${data.testTime}</p>
  
                  <p>Prepare well and don’t miss the opportunity to assess your performance under real exam-like conditions.</p>
  
                  <div style="text-align: center;">
                      <a href="${data.testLink}" class="button">Take the Test</a>
                  </div>
  
                  <p>Good luck!<br>The Gyapak TestSeries Team</p>
              </div>
  
              <div class="footer">
                  <p>You're receiving this reminder because you're enrolled for this mock test on Gyapak TestSeries.</p>
                  <p>
                      <a href="https://insansa.com/privacy-policy">Privacy Policy</a> |
                      <a href="https://insansa.com/unsubscribe?email=${data.email}">Unsubscribe</a>
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;
  };
  