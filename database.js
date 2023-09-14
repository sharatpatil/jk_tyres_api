const sql = require('mssql');
const os = require('os');


let pool; // Declare the pool as a global variable for reuse

function connectToDatabase() {
  const config = {
    user: 'sa',
    password: 'sa123',
    server: `${os.hostname}\\SQLSERVER`,
    database: 'test',
    options: {
      encrypt: false,
    },
  };

  return sql.connect(config);
}


module.exports = {
  connectToDatabase,
  setPool: (newPool) => {
    pool = newPool;
  },
};
