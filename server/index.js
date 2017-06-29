const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mc = require( `${__dirname}/controllers/messages_controller` );
const createInitialSession = require('./middlewares/session');
const filter = require('./middlewares/filter');

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../public/build` ) );
app.use( session( {
    secret: 'alsuydfg3732984hndb2649dbchoqpl2947hbkad9u23hdkjsdbewi839hsdbsdkwu',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 24*60*60*1000, secure: false}
}));
app.use( (req, res, next) => createInitialSession(req, res, next) ); 
app.use( (req, res, next) => {
    if (req.body && req.body.text) {
        return filter(req, res, next)
    }
    next();
} ); // this is instead of adding the middleware to each endpoint 

const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );
app.get(messagesBaseUrl + '/history', mc.history);

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );