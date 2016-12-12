//importing different modules
var express = require('express'),
    mongoose = require('mongoose'),
    stylus = require('stylus'),
    logger = require('morgan'),
    bodyParser = require('body-parser');

//environment variable, to determine if you are in production or development. Setting development as the default if it hasnt been already set
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Creating express application
var app = express();

//middleware configuration for stylus

//compile function that gets used by the middleware
function compile(str, path){
    return stylus(str).set('filename',path);
}

//configure the view engine. Setting the view property where I am holding my views. And informing express that we are using JAde
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');

//Adding bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Add Express logging
app.use(logger('dev'));

//configuring stylus middleware
app.use(stylus.middleware(
    {
        src: __dirname + '/public',
        compile: compile
    }
));

//set up static routing to the public directory. This tells Express that any time any requests come in that match up to a file inside of the public directory
app.use(express.static(__dirname + '/public'));

//MongoDB Connection
mongoose.connect('mongodb://localhost/publicromance');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'ERROR: Could not connect to Database'));
db.once('open', function callback() {
    console.log('Connected to Database')
});

//Adding Schema
var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);
//create a variable that is going to hold the data that we pull out of the database
var mongoMessage;
Message.findOne().exec(function(err, messageDoc) {
    mongoMessage = messageDoc.message;
});


//Adding route to partials
app.get('/partials/:partialPath', function(req,res) {
    //render out anything from the above folder.
    //When somone requests /partials/main express will render the main.jade file
    res.render('partials/' + req.params.partialPath)
});

//Create route for our application
//Telling the server to handle all requests with a callback to render the index page.
app.get('*', function(req, res){
    res.render('index', {mongoMessage: mongoMessage});
});


//Seting up our server to listen on a particualr port.
var port = 3030;
app.listen(port);
console.log('listening on port ' + port + '....');