/**
 * MongoDB Database connection and configuration file
 */

import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const databaseName = process.env.DB_DATABASE || 'files_manager';
    const dbUri = `mongodb://${host}:${port}/${databaseName}`;
    this.client = new MongoClient(dbUri, { useUnifiedTopology: true });
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.client.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
