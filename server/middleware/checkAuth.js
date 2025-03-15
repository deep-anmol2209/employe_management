import jwt from 'jsonwebtoken';
import { configure } from '../config.js';

const auth = (req, res, next) => {
    try {
        // Get the Authorization header
        const tokenHeader = req.headers['authorization']; // Use 'authorization' as header name
        if (!tokenHeader) return res.status(401).json({ msg: "Authorization header missing" });

        // Split the token from "Bearer <token>"
        const tokenParts = tokenHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({ msg: "Invalid token format" });
        }
        const token = tokenParts[1];

        if (!token) return res.status(401).json({ msg: "Token missing" });

        // Verify the token
        jwt.verify(token, configure.jwtsecret, (err, user) => {
            if (err) {
                return res.status(401).json({ msg: "Invalid or expired token" });
            }

            // Attach the user to the request object
            req.user = user;
            
            console.log(req.user)
            
            next();
        });
    } catch (err) {
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

export default auth;
