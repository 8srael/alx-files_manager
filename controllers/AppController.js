/**
 * AppController class file
 * It contains definitions endpoints for the API
 */

import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(__, res) {
    res.status(200).send({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  static async getStats(__, res) {
    res.status(200).send({
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    });
  }
}

export default AppController;
module.exports = AppController;
