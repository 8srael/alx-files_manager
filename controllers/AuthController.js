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
    console.log(req.headers);

    if (!authorization) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const authStr = authorization.split(' ')[1];
    console.log(authStr);
    const buff = Buffer.from(authStr, 'base64');
    console.log(buff.toString());
    const credentials = buff.toString('utf-8').split(':');
    const [email, password] = credentials;
    console.log(email, password);

    const users = dbClient.db.collection('users');

    users.findOne({ email, password: sha1(password) })
      .then((user) => {
        if (!user) {
          res.status(401).json({ error: 'Unauthorized' });
        }
        const key = `auth_${uuidv4()}`;
        redisClient.set(key, user._id.toString(), 86400);
        res.status(200).json({ token: key });
      })
      .catch((err) => console.log(err));
  }

  static getDisconnect(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;

    redisClient.get(key)
      .then((userId) => {
        if (!userId) {
          res.status(401).json({ error: 'Unauthorized' });
        }
        (async () => {
          await redisClient.del(key);
          res.status(204).json({});
        })();
      }).catch((err) => console.log(err));
  }
}

export default AuthController;
module.exports = AuthController;
