export const generateNewTestSeriesEmailTemplate = (data) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>New Test Series Available!</title>
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
              .banner {
                  margin: 20px 0;
                  text-align: center;
              }
              .banner img {
                  max-width: 100%;
                  border-radius: 8px;
              }
              .content {
                  padding: 20px 0;
              }
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #007BFF;
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
                  <img src="/api/placeholder/180/60" class="logo" alt="Attainment Logo" />
                  <h2>📚 New Test Series Launched!</h2>
              </div>
  
              <div class="banner">
                  <img src="/api/placeholder/600x250" alt="New Test Series Banner" />
              </div>
  
              <div class="content">
                  <p>Hello <strong>${data.fullName}</strong>,</p>
  
                  <p>Great news! A brand-new test series titled <strong>“${data.testSeriesName}”</strong> is now live on Gyapak TestSeries.</p>
  
                  <p>🔍 What's inside:</p>
                  <ul>
                      <li>${data.subjects.join(', ')}</li>
                      <li>${data.testCount} full-length tests</li>
                      <li>Real exam pattern & detailed solutions</li>
                      <li>Instant results and performance analysis</li>
                  </ul>
  
                  <div style="text-align: center;">
                      <a href="${data.seriesLink}" class="button">Start Now</a>
                  </div>
  
                  <p>Stay ahead of the competition by practicing with our latest test series designed by experts. 💪</p>
  
                  <p>All the best!<br>The Gyapak TestSeries Team</p>
              </div>
  
              <div class="footer">
                  <p>You're receiving this email because you're subscribed to Gyapak updates.</p>
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
    
  
//   const emailData = {
//     fullName: "Priya Sharma",
//     email: "priya@example.com",
//     testSeriesName: "UPSC Prelims 2025 Booster Pack",
//     testCount: 10,
//     subjects: ["Polity", "Geography", "Current Affairs"],
//     seriesLink: "https://insansa.com/test-series/upsc-booster-2025"
//   };
  