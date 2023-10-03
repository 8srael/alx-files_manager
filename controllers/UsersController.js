/**
 * UsersController class file
 */

import sha1 from 'sha1';
import dbClient from '../utils/db';

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
}

export default UsersController;
module.exports = UsersController;
