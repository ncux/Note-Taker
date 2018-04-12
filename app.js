const express = require('express');
const bodyParser = require('body-parser');
let app = express();
let port = 3000;
const url = 'mongodb://mLabMongoDBdb:mLabMongoDBdb@ds143039.mlab.com:43039/note-taker';

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// database connection:
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(url)
    .then(() => console.log('Database connection established!'))
    .catch((err) => {
    console.log('Error: ' + err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"Greeting": "Welcome to Note Taker!"});
});

// Require routes
require('./routes')(app);

app.listen(port, () => console.log('Server is running on port ' + port));