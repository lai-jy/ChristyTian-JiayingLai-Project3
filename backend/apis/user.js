// apis/user.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserModel = require('../db/user/user.model');

// Get all users
router.get('/', function(request, response) {
    UserModel.find({}).then(function(users) {
        response.send(users);
    });
});

// Login
router.post('/login', async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await UserModel.findUserByUsername(username);
        console.log('Found user:', user);

        if (!user || user.password !== password) {
            return res.status(403).send("Invalid username or password");
        }

        const token = jwt.sign(username, "HUNTERS_PASSWORD");
        res.cookie("username", token);
        return res.json({ username: username });

    } catch (e) {
        console.error('Login error:', e);
        res.status(401).send(null);
    }
});

// Register
router.post('/register', async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if(!username || !password) {
            return res.status(409).send("Missing username or password");
        }

        const createUserResponse = await UserModel.createUser({
            username: username,
            password: password
        });

        const token = jwt.sign(username, "HUNTERS_PASSWORD");
        res.cookie("username", token);
        return res.json({ username: username });

    } catch (e) {
        res.status(401).send("Error: username already exists");
    }
});

// Check if user is logged in
router.get('/isLoggedIn', async function(req, res) {
    const username = req.cookies.username;

    if(!username) {
        return res.send({username: null})
    }

    let decryptedUsername;
    try {
        decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD")
    } catch(e) {
        return res.send({username: null})
    }

    if(!decryptedUsername) {
        return res.send({username: null})
    } else {
        return res.send({username: decryptedUsername})
    }
});

// Logout
router.post('/logOut', async function(req, res) {
    res.cookie('username', '', {
        maxAge: 0,
    });
    res.send(true);
});

// Get user by username
router.get('/:username', async function(req, res) {
    const username = req.params.username;
    try {
        const userData = await UserModel.findUserByUsername(username);
        return res.send(userData);
    } catch (error) {
        return res.status(404).send("User not found");
    }
});

// Get user details
router.get('/:username', async (req, res) => {
    try {
        const user = await UserModel.findUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        console.error('Error getting user details:', error);
        res.status(500).send('Error getting user details');
    }
});

// Update user description (only for logged-in user)
router.put('/:userId/description', async (req, res) => {
    try {
        const userId = req.params.userId;
        const newDescription = req.body.description;
        const updatedUser = await UserModel.updateUserDescription(userId, newDescription);
        res.send(updatedUser);
    } catch (error) {
        console.error('Error updating user description:', error);
        res.status(500).send('Error updating user description');
    }
});

module.exports = router;