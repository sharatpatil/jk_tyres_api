const sql = require('mssql');

function connectToDatabase() {
  const config = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server',
    database: 'your_database',
  };

  return sql.connect(config)
    .then((pool) => {
      console.log('Connected to MSSQL');
      return pool;
    })
    .catch((error) => {
      console.error('Error connecting to MSSQL:', error);
    });
}

module.exports = {
  connectToDatabase,
};

// Rest of your code...
