/**
 *
 * API endpoints file
 *
 */

import AppController from '../controllers/AppController';

const allAppRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
};

module.exports = allAppRoutes;
