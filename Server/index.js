await import('./config/env.js');
import App from './app.js';
import { PORT,NODE_ENV } from './config/env.js';

const initializeServer = async () => {
  try {

    const app = await App();


    // Test server health
    app.get('/', (req, res) => {
      res.send('Server is running perfectly !!');
    });

    // Start listening on the specified port
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error in initializing server:', err);
    process.exit(1);
  }
};

// Only initialize the server if not running in serverless mode
if (NODE_ENV !== 'serverless') {
  initializeServer();
}

// Export app for serverless platforms (e.g., Vercel)
export default App;
