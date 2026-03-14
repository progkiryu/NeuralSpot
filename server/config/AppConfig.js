const helmet = require('helmet')
var cookieParser = require('cookie-parser');
const express = require('express');
const scanRoutes = require('../routes/scanRoutes');

exports.appConfig = async (app) => {
  const port = process.env.PORT || 5500;
  app.use(helmet())
  app.use(cookieParser());
  app.use(express.json());
  app.use('/api/scan', scanRoutes); 
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  })
}