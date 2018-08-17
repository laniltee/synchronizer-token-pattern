const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const PORT = 8080;

// Applying middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Views
app.use(express.static('views'));
app.use(express.static('styles'));

// Server Startup
app.listen(PORT, () => {
    console.log(`Synchronize Token Pattern Demo Started On ${PORT}`);
});

// JS Object to store Session IDs with CSRF tokens
const SESSION_IDS = {};

// Login Page Load
app.get('/', (req, res) => {
    res.sendFile('views/login.html', {root: __dirname});
});

// Validate Credentials
app.post('/login', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (username === 'root' && password === 'root') {

    }

});

// Returns CSRF for the given Session ID
app.post('/tokens', (req, res) => {
    const token = req.body.token;
    if (SESSION_IDS[token]) {
        const response = {token: SESSION_IDS[token]};
        res.json(response);
    } else {
        const error = {status: 400, message: 'Invalid Session ID'};
        res.status(400).json(error)
    }
});

// respond with "hello world" when a GET request is test route
app.get('/health', function (req, res) {
    res.send('Welcome to Synchronize Token Pattern Demo !')
});