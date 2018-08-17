const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const cookieParser = require('cookie-parser');

const app = express();

const PORT = 8080;

// Applying middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

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
app.post('/home', (req, res) => {

    const username = req.body.inputUsername;
    const password = req.body.inputPassword;

    if (username === 'root' && password === 'root') {

        // Generating Session ID and Token
        const SESSION_ID = uuidv1();
        const CSRF_TOKEN = uuidv4();

        // Saving token with session ID
        SESSION_IDS[SESSION_ID] = CSRF_TOKEN;

        // Setting Cookie on Header
        res.setHeader('Set-Cookie', [`session-id=${SESSION_ID}`, `time=${Date.now()}`]);

        res.sendFile('views/form.html', {root: __dirname});
    } else {
        const error = {status: 401, message: 'Invalid Credentials'};
        res.status(400).json(error)
    }

});

// Returns CSRF for the given Session ID
app.post('/tokens', (req, res) => {
    const sessionID = req.cookies['session-id'];
    console.log(sessionID);
    if (SESSION_IDS[sessionID]) {
        const response = {token: SESSION_IDS[sessionID]};
        res.json(response);
    } else {
        const error = {status: 400, message: 'Invalid Session ID'};
        res.status(400).json(error)
    }
});


// Submit Form Data
app.post('/posts', (req, res) => {

    const inputTitle = req.body.inputTitle;
    const inputContent = req.body.inputContent;
    const inputToken = req.body.inputToken;
    const sessionID = req.cookies['session-id'];

    console.log(req.body);

    // Checking if Session ID matches CSRF Cookie
    if (SESSION_IDS[sessionID] && SESSION_IDS[sessionID] === inputToken) {
        res.sendFile('views/form-success.html', {root: __dirname});
    } else {
        res.sendFile('views/form-error.html', {root: __dirname});
    }

});

// respond with "hello world" when a GET request is test route
app.get('/health', function (req, res) {
    res.send('Welcome to Synchronize Token Pattern Demo !')
});