const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const dbPath = './wisdompeakusersdata.db';

const initializeDb = async () => {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
};

module.exports = initializeDb;
