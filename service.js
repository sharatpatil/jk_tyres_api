const Service = require('node-windows').Service;

// Create a new service object
const svc = new Service({
  name: 'JK tyres api',
  description: 'JK tyres api',
  script: 'D:\nodejs\jk_tyres_api\index.js', // Replace with the full path to your app.js file
});

// Listen for the "install" event
svc.on('install', () => {
  // Start the service after installation
  svc.start();
});

// Install the service
svc.install();
