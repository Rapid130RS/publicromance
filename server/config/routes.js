var auth = require('./auth'),
    users = require('../controllers/users'),
    products = require('../controllers/products'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function (app) {


    //creating RESTful services


    //create route to check if user is admin role and then returns a list of all our users .
    app.get('/api/users', auth.requiresRole('admin'), users.getUsers);

    //create route to create user.
    app.post('/api/users', users.createUser);

    //create route to update the user
    app.put('/api/users', users.updateUser);

    //route to get stock list
    app.get('/api/stock', products.getProducts);

    //rotue to get indvidual product id page
    app.get('/api/stock/:id', products.getProductById);

    //Adding route to partials
    app.get('/partials/*', function(req,res) {
        //render out anything from the above folder.
        //When somone requests /partials, request.params will call upon item in first array and then call on the file, which is located in publicromance/public/app/*
        res.render('../../public/app/' + req.params[0]);
    });

    //route to login,
    app.post('/login', auth.authenticate);

    //route to logut
    app.post('/logout', function(req, res ) {
        //request to logout, end response
        req.logout();
        res.end();
    });

    //route to respond with 404 when getting a out of bound API route
    //route that responds to all verbs not juget GET
    app.all('/api/*', function(req, res){
        res.sendStatus(404)
    });

    //Create route for our application
    //Telling the server to handle all requests with a callback to render the index page.
    app.get('*', function(req, res){
        res.render('index', {
            //Bootstrap user to allow angular get current user via layout / mvIdentity
            bootstrappedUser: req.user
        });
    });

};