/**
 * Serer configuration file
 */

import express from 'express';
import allAppRoutes from './routes/index';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

allAppRoutes(app);

app.listen(PORT, () => {
  console.log(`+++++++ Server running on port ${PORT} +++++++`);
});

module.exports = app;
