const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/RPGsite', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const bcrypt = require('bcrypt');
const saltRounds = 10; // Security hashing iteration number for bcrypt

const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token expired or invalid' });
        }
        req.user = decoded.username;
        next();
    });
};

//setup mongo schemes
const accountSchema = new mongoose.Schema({
    username: { type: String, unique: true },   //unique id - account username
    password: String,                           //hashed code that must contain 8 chars, both uppercase and lowercase, minimum 1 number and minimum 1 special char
    isAdmin: Boolean                            //whether the account has admin privileges
});
const Account = mongoose.model('Account', accountSchema);

const playerSchema = new mongoose.Schema({
    name: { type: String, unique: true },       //unique id - name of character
    creator: String                             //username of account that created the character
});
const Player = new mongoose.model('Player', playerSchema);

//API Functions
//HELPER Functions

//MAIN Functions
app.post('/api/create', async (req, res) => { // Creating an Account
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const account = new Account({
        username: req.body.username,
        password: hashedPassword,
        isAdmin: false
    });
    try {
        await account.save();
        console.log("New account saved to database: " + account.username);
        return res.status(201).json({ message: 'Account created successfully!'});
    } catch(err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Username already taken.' });
        } else {
            return res.status(503).json({ message: 'Problem connecting to database.' });
        }
    }
});

app.post('/api/login', async (req, res) => { // Logging in with an Account
    const { username, password } = req.body;
    try {
        const account = await Account.findOne({ username });
        if(!account) {
            return res.status(404).json({ message: 'No account with that username found.' });
        }
        if (!bcrypt.compareSync(password, account.password)) {
            return res.status(401).json({ message: 'Incorrect password for that username.' });
        }

        const token = jwt.sign({ username: account.username }, secretKey, { expiresIn: '30m' });
        console.log(account.username + " logged in.")
        return res.status(200).json({ message: 'Login successful', token });

    } catch (err) {
        return res.status(503).json({ message: 'Problem connecting to database' });
    }
});

//Start Server
app.listen(3000, () => console.log('Server started on port 3000!'));