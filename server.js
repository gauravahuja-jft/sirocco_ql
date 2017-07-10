import Express from 'express';
import graphqlHTTP from 'express-graphql';
import Schema from './schema';

const PORT = 3000;

var app = Express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.sendStatus(200)    }
    else {
        //move on
        next();
    }
});
// GraphqQL server route
app.use('/graphql', graphqlHTTP(req => ({
    schema: Schema,
    pretty: true,
    graphiql: true
})));

// start server
var server = app.listen(PORT, () => {
    console.log('Listening at port', server.address().port);
});