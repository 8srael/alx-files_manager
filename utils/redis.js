/**
 * Redis utils module
 */

import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.log(`Redis client not connected to the server: ${err.message}`);
      this.isClientConnected = false;
    });

    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if the client's connection to the Redis server is active
   * @returns {Boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the value from a given key
   * @param {String} key
   * @returns {Object}
   */
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  /**
   * Stores a key and it value along with an expiration time
   * @param {String} key
   * @param {Object} value
   * @param {Number} duration
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    const setAsync = promisify(this.client.setex).bind(this.client);
    await setAsync(key, duration, value);
  }

  /**
   * Removes a value from the gien key
   * @param {String} key
   * @returns {Promise<void>}
   */
  async del(key) {
    promisify(this.client.del).bind(this.client)(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
