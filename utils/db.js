/**
 * MongoDB Database connection and configuration file
 */

import { MongoClient } from 'mongodb';

const HOST = process.env.DB_HOST || '127.0.0.1';
const PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_DATABASE || 'files_manager';

const dbUri = `mongodb://${HOST}:${PORT}`;

class DBClient {
  constructor() {
    console.log(dbUri);
    this.client = new MongoClient(dbUri, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      this.db = this.client.db(DB_NAME);
    }).catch((err) => {
      console.error(err.message);
      this.db = false;
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
