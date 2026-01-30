const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Auth Controller:
 * --> Register/Login
 * --> Issues JWT Tokens
 */

function signToken(user){
    // JWT best practices: use 'sub' for subject (user id)
    return jwt.sign(
        {email: user.email, name: user.name},
        process.env.JWT_SECRET,
        {
            subject: String(user._id), 
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
    )
}

// POST /api/auth/register
async function register(req, res, next){
    try{
        // DEBUG: Log what we're receiving
        console.log('📥 Register Request:');
        console.log('   Headers:', req.headers);
        console.log('   Body:', req.body);
        console.log('   Body type:', typeof req.body);
        
        // Check if body exists
        if (!req.body) {
            console.log('❌ req.body is undefined or null!');
            return res.status(400).json({error: "Request body is missing. Make sure you're sending JSON data with Content-Type: application/json"});
        }

        const {name, email, password} = req.body;
        
        // If there are missing fields return error
        if(!name || !email || !password){
            console.log('❌ Missing fields:', {name: !!name, email: !!email, password: !!password});
            return res.status(400).json({error: "name, email, and password are required"});
        }

        const existing = await User.findOne({email: email.toLowerCase()});
        if(existing) return res.status(409).json({error: "Email already in use"});
        
        // Hash password before storing in database
        const passwordHash = await bcrypt.hash(password, 12);
        
        // Create user record
        const created = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash
        })

        const token = signToken(created);

        console.log('✅ User registered successfully:', created.email);

        res.status(201).json({
            data: {
                token,
                user: { id: created._id, name: created.name, email: created.email }
            }
        });

    }catch(err){
        console.log('❌ Register error:', err);
        next(err)
    }
}

// POST /api/auth/login
async function login(req, res, next){
    try{
        // DEBUG: Log what we're receiving
        console.log('📥 Login Request:');
        console.log('   Body:', req.body);
        
        if (!req.body) {
            return res.status(400).json({error: "Request body is missing"});
        }

        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error: "email and password are required"});
        }
        
        // Find user by email
        const user = await User.findOne({email: email.toLowerCase()});
        if(!user) return res.status(401).json({error: "Invalid Credentials"});
        
        // Compare password with hashed password
        const ok = await bcrypt.compare(password, user.passwordHash);
        if(!ok) return res.status(401).json({error: "Invalid Credentials"});
        
        const token = signToken(user);

        console.log('✅ User logged in successfully:', user.email);

        res.json({
            data: {
                token,
                user: { id: user._id, name: user.name, email: user.email }
            }
        });
    }catch(err){
        console.log('❌ Login error:', err);
        next(err)
    }
}

module.exports = {register, login};