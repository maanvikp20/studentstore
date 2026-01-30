require('dotenv').config();
const jwt = require('jsonwebtoken');

function requireAuth(req,res,next) {
    try{
        const authHeader = req.headers.authorization || '';
        const [scheme, token] = authHeader.split(" ");

        if(scheme !== "Bearer" || !token){
            return res.status(401).json({error:"missing or invalid Authorization Header"})
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        // Attach authenticated user to request for controllers to use
        // Payload.sub = _id from mongoDB
        req.user = {id:payload.sub, email:payload.email, name:payload.name};
        next();


    }catch(err){
        console.log("Auth Middleware Error:", err)
        return res.status(401).json({error:"Unauthorized"})
    }
}
module.exports = {requireAuth};