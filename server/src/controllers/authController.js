const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Auth Contoller:
 * --> Register/Login
 * --> Issues JWT Tokens
 */

function signToken(user){
    //JWT best practises: use 'sub' for subject (user id)
    return jwt.sign(
        {email:user.email, name:user.name},
        process.env.JWT_SECRET,
        {subject: String(user._id), expiresIn: process.env.JWT_EXPIRES_IN || '7d'}
    )
}

// POST /api/auth/register
async function register(req, res, next){
    try{
        const {name, email, password} = req.body;
        // If there are missing fields return error
        if(!name || !email || !password){
            return res.status(409).json({error:"name, email"});
        }

        const existing = await User.findOne({email: email.toLowerCase()});
        if(existing) return res.status(409).json({error:"Email already in use"});
        //Hash password before storing in database
        const passwordHash = await bcrypt.hash(password, 12);
        //Create user record
        const created = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash
        })

        const token = signToken (created);
        
        res.status(201).json({
            data: {
                token,
                user: { id: created._id, name: created.name, email: created.email }
            }
        });

    }catch(err){
        next(err)
    }
}

// POST /api/auth/login
async function login(req, res, next){
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error:"email and password are required"});
        }
        //Find user by email
        const user = await User.findOne({email: email.toLowerCase()});
        if(!user) return res.status(401).json({error:"Invalid Credentials"});
        //Compare password with hashed password
        const ok = await bcrypt.compare(password, user.passwordHash);
        if(!ok) return res.status(404).json({error:"Invalid Credentials"});
        // We put "invalid credentials" for both email and password errors so if someone is trying to brute force and sees that only one is 
        // incorrect they can focus on the other one and try and brute force it
        const token = signToken(user);

        res.json({
            data: {
                token,
                user:{ id: user._id, name: user.name, email: user.email}
            }
        });
    }catch(err){
        next(err)
    }
}

module.exports = {register, login};