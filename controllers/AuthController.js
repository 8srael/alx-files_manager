/**
 * AuthController module.
 * Authentication class controller.
 */

import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static getConnect(req, res) {
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const authStr = authorization.split(' ')[1];
    const buff = Buffer.from(authStr, 'base64');
    const credentials = buff.toString('utf-8').split(':');
    if (credentials.length !== 2) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const users = dbClient.db.collection('users');
    users.findOne({ email: credentials[0], password: sha1(credentials[1]) })
      .then((user) => {
        if (!user) {
          res.status(401).json({ error: 'Unauthorized' });
        }
        const key = `auth_${uuidv4()}`;
        redisClient.set(key, user._id.toString(), 86400);
        res.status(200).json({ token: key.substring(5) });
      })
      .catch((err) => console.log(err));
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;

    const userId = await redisClient.get(key);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await redisClient.del(key);
    res.status(204).json({});
  }
}

export default AuthController;
module.exports = AuthController;
