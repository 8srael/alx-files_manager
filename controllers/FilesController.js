/**
 *
 * FilesController class file
 * It contains all methods managing the endpoints for files
 *
 */

import { ObjectID } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class FilesComtroller {
  static async getUser(req) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return null;
    }
    const users = dbClient.db.collection('users');
    const user = await users.findOne({ _id: ObjectID(userId) });
    if (!user) {
      return null;
    }
    return user;
  }

  static async postUpload(req, res) {
    const user = await FilesComtroller.getUser(req);

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const {
      name, type, data, parentId,
    } = req.body;
    const isPublic = req.body.isPublic || false;

    if (!name) {
      res.status(400).json({ error: 'Missing name' });
      return;
    }
    if (!type) {
      res.status(400).json({ error: 'Missing type' });
      return;
    }
    if (!data && type !== 'folder') {
      res.status(400).json({ error: 'Missing data' });
      return;
    }
    const files = dbClient.db.collection('files');
    if (parentId) {
      const file = await files.findOne({ _id: ObjectID(parentId) });
      if (!file) {
        res.status(400).json({ error: 'Parent not found' });
        return;
      }
      if (file.type !== 'folder') {
        res.status(400).json({ error: 'Parent is not a folder' });
        return;
      }
    }
    if (type === 'folder') {
      files.insertOne(
        {
          userId: user._id,
          name,
          type,
          isPublic,
          parentId: parentId || 0,
        },
      ).then((result) => {
        res.status(201).json({
          id: result.insertedId,
          userId: user._id,
          name,
          type,
          isPublic,
          parentId: parentId || 0,
        });
      }).catch((err) => console.log(err));
    } else {
      const filePath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const fileName = `${filePath}/${uuidv4()}`;
      const buff = Buffer.from(data, 'base64');

      try {
        await fs.writeFile(fileName, buff, 'utf-8');
      } catch (err) {
        console.log(err);
      }

      files.insertOne({
        userId: user._id,
        name,
        type,
        isPublic,
        parentId: parentId || 0,
        localPath: fileName,
      }).then((result) => {
        res.status(201).json({
          id: result.insertedId,
          userId: user._id,
          name,
          type,
          isPublic,
          parentId: parentId || 0,
          localPath: fileName,
        });
      }).catch((err) => console.log(err));
    }
  }
}

export default FilesComtroller;
module.exports = FilesComtroller;
