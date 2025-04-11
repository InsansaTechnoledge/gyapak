export const generateMockTestResultEmailTemplate = (data) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Mock Test Result</title>
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
              .score-box {
                  background-color: #f0f8ff;
                  padding: 15px;
                  border-radius: 5px;
                  text-align: center;
                  margin: 20px 0;
                  font-size: 18px;
                  font-weight: bold;
              }
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #007bff;
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
                  <h2>📊 Your Mock Test Result</h2>
              </div>
  
              <div class="content">
                  <p>Hi <strong>${data.fullName}</strong>,</p>
  
                  <p>Thank you for participating in the mock test <strong>“${data.testName}”</strong>.</p>
  
                  <div class="score-box">
                      Your Score: ${data.score} / ${data.totalMarks}<br />
                      Rank: ${data.rank} out of ${data.totalParticipants}
                  </div>
  
                  <p>Review your detailed performance, question-wise analysis, and solutions by clicking below:</p>
  
                  <div style="text-align: center;">
                      <a href="${data.resultLink}" class="button">View Full Result</a>
                  </div>
  
                  <p>Keep practicing and improving! We’re cheering for your success 🚀</p>
  
                  <p>– The Gyapak TestSeries Team</p>
              </div>
  
              <div class="footer">
                  <p>You are receiving this email because you're enrolled in our test series on Gyapak TestSeries.</p>
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
  