/**
 *
 * API endpoints file
 *
 */

import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesComtroller from '../controllers/FilesController';

const allAppRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
  app.post('/users', UsersController.postNew);
  app.get('/connect', AuthController.getConnect);
  app.get('/disconnect', AuthController.getDisconnect);
  app.get('/users/me', UsersController.getMe);
  app.post('/files', FilesComtroller.postUpload);
};

module.exports = allAppRoutes;
