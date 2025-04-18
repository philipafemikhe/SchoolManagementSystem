﻿require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



// api routes
app.use('/users', require('./controller/users.controller'));
app.use('/roles', require('./controller/roles.controller'));

app.get('/test', (req, res) => { 
    res.send( { 
        title: 'My Express Js', 
        name: 'Philip Afemikhe' 
    }) 
})  

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));