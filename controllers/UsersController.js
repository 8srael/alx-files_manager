/**
 * UsersController class file
 */

import sha1 from 'sha1';
import { ObjectID } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    const users = dbClient.db.collection('users');

    users.findOne({ email })
      .then((user) => {
        if (user) {
          res.status(400).json({ error: 'Already exist' });
          return;
        }
        users.insertOne({
          email,
          password: sha1(password),
        }).then((result) => res.status(201).json({ id: result.insertedId, email }))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;

    const userId = await redisClient.get(key);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const users = dbClient.db.collection('users');
    const user = await users.findOne({ _id: ObjectID(userId) });
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;
module.exports = UsersController;
