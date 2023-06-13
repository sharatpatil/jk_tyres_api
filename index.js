// const express = require('express');
// const sql = require('mssql');

// const app = express();
// const port = 3001;

// const config = {
//   user: 'sa',
//   password: 'sa123',
//   server: 'J2W-LAP-0165',
//   database: 'test',
// };

// // Connect to the database
// async function connectToDatabase() {
//   try {
//     await sql.connect(config);
//     console.log('Connected to MSSQL');
//   } catch (error) {
//     console.error('Error connecting to MSSQL:', error);
//   }
// }

// // Middleware to handle database connection
// app.use((req, res, next) => {
//     if (!pool) {
//       sql.connect(config)
//         .then((connectionPool) => {
//           pool = connectionPool;
//           next();
//         })
//         .catch((error) => {
//           console.error('Error connecting to MSSQL:', error);
//           res.status(500).json({ error: 'Failed to connect to the database' });
//         });
//     } else {
//       next();
//     }
//   });
  

// // Example route
// app.get('/', (req, res) => {
//   const request = new sql.Request();
//   request.query('SELECT * FROM YourTable')
//     .then((result) => {
//       res.json(result.recordset);
//     })
//     .catch((error) => {
//       res.status(500).json({ error: 'Error executing query' });
//     });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });



const express = require('express');
const sql = require('mssql');

const app = express();
const port = 3001;

const config = {
    user: 'sa',
    password: 'sa123',
    server: 'J2W-LAP-0165',
    database: 'test',
  };

let pool;

sql.connect(config)
  .then((connectionPool) => {
    pool = connectionPool;
    console.log('Connected to MSSQL');
  })
  .catch((error) => {
    console.error('Error connecting to MSSQL:', error);
  });

app.get('/', (req, res) => {
  const request = pool.request();
  request.query('SELECT * FROM YourTable')
    .then((result) => {
      res.json(result.recordset);
    })
    .catch((error) => {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Error executing query' });
    });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
