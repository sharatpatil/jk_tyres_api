// const PORT = 4000;
// const os = require('os');


// const sql = require('mssql');
// const axios = require('axios');

// const headers = {
//   'Content-Type': 'application/json',
//   'X-Access-Key': '8a31ef8btf65c31tc15dt32e888c3ab731e919ac'
// };

// const apiUrl = 'https://api.datonis.io/api/v3/datonis_query/thing_data';
// const pageSize = 100; // Number of records per page
// let currentPage = 1;
// let totalRecords = 0;
// let totalPages = 0;

// const config = {
//   user: 'sa',
//   password: 'sa123',
//   server: `${os.hostname}\\SQLSERVER`,
//   database: 'test',
//   options: {
//     encrypt: false,
//   },
// };
// function insertEventData(eventData) {
//   let count = 0; // Counter for the number of records inserted

//   for (const event of eventData) {
//     const query = 'SELECT COUNT(*) AS count FROM things_data WHERE timestamp = @timestamp';
//     const request = pool.request()
//       .input('timestamp', sql.DateTime, event.timestamp);

//     request.query(query)
//       .then((result) => {
//         const recordCount = result.recordset[0].count;

//         if (recordCount === 0) {
//           const insertQuery = `
//             INSERT INTO things_data (timestamp, created_at, width_set, recipe_at_main_controller, width_actual_right, width_actual_left)
//             VALUES (@timestamp, @created_at, @width_set, @recipe_at_main_controller, @width_actual_right, @width_actual_left)
//           `;
//           const insertRequest = pool.request()
//             .input('timestamp', sql.DateTime, event.timestamp)
//             .input('created_at', sql.DateTime, event.created_at)
//             .input('width_set', sql.Float, event.data.Width_set)
//             .input('recipe_at_main_controller', sql.VarChar(255), event.data.Recipe_at_main_controller)
//             .input('width_actual_right', sql.Float, event.data.Width_actual_right)
//             .input('width_actual_left', sql.Float, event.data.Width_actual_left);

//           insertRequest.query(insertQuery)
//             .then(() => {
//               count++;
//               console.log(`Record ${count}/${eventData.length} inserted successfully for page ${currentPage}`);
//             })
//             .catch((error) => {
//               console.error('Error inserting data:', error);
//             });
//         } else {
//           console.log('Record already exists:', event.timestamp);
//         }
//       })
//       .catch((error) => {
//         console.error('Error checking for duplicate records:', error);
//       });
//   }
// }


// function fetchEventData(pageNumber, pool) {

//   const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in "YYYY-MM-DD" format

//   const data = {
//     idle_time_required: true,
//     time_zone: 'Asia/Calcutta',
//     thing_key: 'efeded6tbb',
//     from: `${currentDate} 00:00:00`,
//     to: `${currentDate} 23:59:59`,
//     page: pageNumber,
//     page_size: pageSize
//   };

  

//   axios
//     .post(apiUrl, data, { headers })
//     .then((response) => {
//       const apiResponse = response.data;
//       const eventData = apiResponse.efeded6tbb.event_data;
//       totalRecords = apiResponse.efeded6tbb.total_event_count;
//       totalPages = Math.ceil(totalRecords / pageSize);

//       insertEventData(eventData, pool);

//       if (currentPage < totalPages) {
//         currentPage++;
//         fetchEventData(currentPage, pool); // Fetch the next page of data
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// // Connect to the MSSQL database
// sql
//   .connect(config)
//   .then((pool) => {
//     console.log('Connected to the MSSQL database.');

//     // Call the fetchEventData function to start fetching and inserting the data
//     fetchEventData(currentPage, pool);
//   })
//   .catch((err) => {
//     console.error('Error:', err);
//   });





const PORT = 4000;
const os = require('os');

const express = require('express');
const sql = require('mssql');
const axios = require('axios');
const cron = require('node-cron');

const app = express();

const headers = {
  'Content-Type': 'application/json',
  'X-Access-Key': '8a31ef8btf65c31tc15dt32e888c3ab731e919ac'
};

const apiUrl = 'https://api.datonis.io/api/v3/datonis_query/thing_data';
const pageSize = 100; // Number of records per page
let currentPage = 1;
let totalRecords = 0;
let totalPages = 0;

const config = {
  user: 'sa',
  password: 'sa123',
  server: `${os.hostname}\\SQLSERVER`,
  database: 'test',
  options: {
    encrypt: false,
  },
};

let pool; // Define the pool variable

function insertEventData(eventData) {
  let count = 0; // Counter for the number of records inserted

  for (const event of eventData) {
    const query = 'SELECT COUNT(*) AS count FROM things_data WHERE timestamp = @timestamp';
    const request = pool.request()
      .input('timestamp', sql.DateTime, event.timestamp);

    request.query(query)
      .then((result) => {
        const recordCount = result.recordset[0].count;

        if (recordCount === 0) {
          const insertQuery = `
            INSERT INTO things_data (timestamp, created_at, width_set, recipe_at_main_controller, width_actual_right, width_actual_left)
            VALUES (@timestamp, @created_at, @width_set, @recipe_at_main_controller, @width_actual_right, @width_actual_left)
          `;
          const insertRequest = pool.request()
            .input('timestamp', sql.DateTime, event.timestamp)
            .input('created_at', sql.DateTime, event.created_at)
            .input('width_set', sql.Float, event.data.Width_set)
            .input('recipe_at_main_controller', sql.VarChar(255), event.data.Recipe_at_main_controller)
            .input('width_actual_right', sql.Float, event.data.Width_actual_right)
            .input('width_actual_left', sql.Float, event.data.Width_actual_left);

          insertRequest.query(insertQuery)
            .then(() => {
              count++;
              console.log(`Record ${count}/${eventData.length} inserted successfully for page ${currentPage}`);
            })
            .catch((error) => {
              console.error('Error inserting data:', error);
            });
        } else {
          console.log('Record already exists:', event.timestamp, "On", new Date().toLocaleString('en-US', { timeZone: 'Asia/Calcutta' }));
        }
      })
      .catch((error) => {
        console.error('Error checking for duplicate records:', error);
      });
  }
}

function fetchEventData(pageNumber) {
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in "YYYY-MM-DD" format

  const data = {
    idle_time_required: true,
    time_zone: 'Asia/Calcutta',
    thing_key: 'efeded6tbb',
    from: `${currentDate} 00:00:00`,
    to: `${currentDate} 23:59:59`,
    page: pageNumber,
    page_size: pageSize
  };

  axios
    .post(apiUrl, data, { headers })
    .then((response) => {
      const apiResponse = response.data;
      const eventData = apiResponse.efeded6tbb.event_data;
      totalRecords = apiResponse.efeded6tbb.total_event_count;
      totalPages = Math.ceil(totalRecords / pageSize);

      insertEventData(eventData);

      if (currentPage < totalPages) {
        currentPage++;
        fetchEventData(currentPage); // Fetch the next page of data
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// Connect to the MSSQL database
sql
  .connect(config)
  .then((poolInstance) => {
    console.log('Connected to the MSSQL database.');
    pool = poolInstance; // Assign the pool instance to the global variable

    // Call the fetchEventData function to start fetching and inserting the data
    fetchEventData(currentPage);

    // Schedule fetchEventData to run every hour using cron job syntax
    cron.schedule('*/2 * * * *', () => {
      fetchEventData(currentPage);
    });
  })
  .catch((err) => {
    console.error('Error:', err);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

