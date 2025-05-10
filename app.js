require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('_middleware/error-handler');
const consoler = require('_helpers/consoler');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// app.use(methodOverride('_method'));
app.use(cors());




app.use((req, res, next)=>{
    consoler.log('New request on Url ' + req.url);
    consoler.log('Host ' + req.hostname);
    consoler.log('path ' + req.path);
    consoler.log('method ' + req.method);
    next();
});



// api routes
app.use('/users', require('./controller/users.controller'));
app.use('/roles', require('./controller/roles.controller'));
app.use('/subject', require('./controller/tenant/subject.controller'));
app.use('/auth', require('./controller/auth.controller'));

app.get('/test', (req, res) => { 
    res.send( { 
        title: 'My Express Js', 
        name: 'Philip Afemikhe' 
    }) 
}) ;

app.use((req, res)=>{
    res.status(404).json({'description':'Page not found', 'code':404,'status':false});
});

// global error handler
app.use(errorHandler);
// app.use(resolveTenant);


// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));