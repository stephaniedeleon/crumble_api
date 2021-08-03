const express = require('express');
const User = require('../models/users');
const tokens = require('../utils/tokens');
const security = require('../middleware/security');
const router = express.Router();

router.post('/login', async (request, response, next) => {
    try {
        const user = await User.login(request.body);
        const token = tokens.createUserJwt(user);
        return response.status(200).json({ user, token });
    } catch(error) {
        next(error);
    }
})

router.post('/register', async (request, response, next) => {
    try {
        const user = await User.register(request.body);
        const token = tokens.createUserJwt(user);
        return response.status(201).json({ user, token });
    } catch(error) {
        next(error);
    }
})

router.get('/me', security.requireAuthenticatedUser, async (request, response, next) => {
    try {
        const { email } = response.locals.user;
        const user = await User.fetchUserByEmail(email);
        const publicUser = await User.makePublicUser(user);
        return response.status(200).json({ user: publicUser });
    } catch(error) {
        next(error);
    }
})

module.exports = router;