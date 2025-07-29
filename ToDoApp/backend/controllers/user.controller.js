import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const userController = {
// REGISTER
    register : async (req, res) => {
        const { firstName, lastName, email, password, confirmPassword } = req.body; 

     try {
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        res.status(201).json(newUser);

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Registration failed" });
    }
},

// LOGIN
    login : async (req, res) => {
        const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
        return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
        return res.status(400).json({ error: 'Invalid Email or Password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
        });

        res.json({
        token,
        loggedUser: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
    }
}

export default userController;