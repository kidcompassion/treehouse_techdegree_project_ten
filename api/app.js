'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');


// Include models db file, but grab only sequelize instance from it, since we need it for the authenticiation function
const { sequelize } = require('./models');

// Set up router files
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

// Set up connection test
const authentication = async ()=>{
    try{
      await sequelize.authenticate();
      console.log('Connection successful');
    } catch(err){
        console.log('No connection', err);
    }  
}

authentication();

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express()
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json


app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Set up subroutes
app.use('/', indexRouter);
app.use('/api', apiRouter);


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});


