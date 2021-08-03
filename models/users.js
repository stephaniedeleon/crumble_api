const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR }  = require('../config');
const db = require('../db');
const { BadRequestError, UnauthorizedError } = require('../utils/errors');

class User {
    static makePublicUser(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            createdAt: user.created_at,
        }
    }

    static async login(credentials) {
        const requiredFields = ['email', 'password'];
        requiredFields.forEach((field) => {
            if (!credentials?.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`);
            }
        })

        const user = await User.fetchUserByEmail(credentials.email);
        if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (isValid) {
                return User.makePublicUser(user);
            }
        }

        throw new UnauthorizedError('Invalid Email or Password');
    }

    static async register(credentials) {
        const requiredFields = ['email', 'password', 'firstName', 'lastName'];
        requiredFields.forEach((field) => {
            if (!credentials?.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`);
            }
        })

        if (credentials.firstName.trim() === "" || credentials.lastName.trim() === "")
            throw new BadRequestError(`Invalid first or last name.`)

        if (credentials.email.indexOf('@') <= 0) {
            throw new BadRequestError('Invalid Email.');
        }

        if (credentials.password.trim() === "")
            throw new BadRequestError('Invalid Password')

        const existingUser = await User.fetchUserByEmail(credentials.email);
        if (existingUser) {
            throw new BadRequestError(`A user already exists with email: ${credentials.email}`);
        }

        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR);
        const normalizedEmail = credentials.email.toLowerCase();

        const userResult = await db.query(
            `
                INSERT INTO users (email, first_name, last_name, password)
                VALUES ($1, $2, $3, $4)
                RETURNING id, email, first_name, last_name, created_at;
            `,
            [
                normalizedEmail,
                credentials.firstName,
                credentials.lastName,
                hashedPassword
            ]
        )

        const user = userResult.rows[0];

        return User.makePublicUser(user);

    }

    static async update(credentials) {
        const requiredFields = ['email', 'firstName', 'lastName'];
        requiredFields.forEach((field) => {
            if (!credentials?.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`);
            }
        })

        console.log(credentials);

        const existingUser = await User.fetchUserByEmail(credentials.email);
        if (existingUser) {
            throw new BadRequestError(`A user already exists with email: ${credentials.email}`);
        }

        const normalizedEmail = credentials.email.toLowerCase();

        const query = `
            UPDATE users
            SET email = $1, first_name = $2, last_name = $3, updated_at = NOW()
            WHERE users.id = $4
            RETURNING id, email, first_name, last_name, created_at, updated_at;
        `

        const result = await db.query(query, [normalizedEmail, credentials.firstName, credentials.lastName, credentials.user.id])

        const user = result.rows[0];

        return User.makePublicUser(user);
    }

    static async fetchUserByEmail(email) {
        if (!email) {
            throw new BadRequestError('No email provided');
        }

        const query = ` SELECT * FROM users WHERE email = $1 `;

        const result = await db.query(query, [email.toLowerCase()]);

        const user = result.rows[0];

        return user;

    }

}

module.exports = User;