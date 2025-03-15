import admin from "../model/adminModel.js";
import employee from "../model/employeeModel.js"; // Import Employee model
import jwt from "jsonwebtoken";
import { configure } from "../config.js";
import bcrypt from "bcrypt";
// Ensure you have this installed

const userAuthcontrol = {

    refreshtoken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;

            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" });

            jwt.verify(rf_token, configure.refreshsecret, (err, user) => {
                if (err) return res.status(400).json({ msg: "Invalid Refresh Token" });
                const accesstoken = createAccessToken({ id: user.id, role: user.role, name: user.name, profilePicture: user.profilePicture });
                res.json({ accesstoken });
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            let user = await admin.findOne({ email });
            if (!user) {
                user = await employee.findOne({ email });
            }

            if (!user) return res.status(400).json({ msg: "User does not exist" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Incorrect Password" });

            const accesstoken = createAccessToken({ id: user._id, role: user.role, name: user.name, profilePicture: user.profilePicture });
            const refreshtoken = createRefreshToken({ id: user._id, role: user.role, name: user.name, profilePicture: user.profilePicture });

            // Set refresh token in HTTP-only cookie
            res.cookie('refreshtoken', refreshtoken, { 
                httpOnly: true, 
                secure: true,
                sameSite: 'None' ,
                path:  '/'        // Adjust as necessary (Lax, Strict, None)
            });

            res.json({ accesstoken, refreshtoken });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    },

    logout: async (req, res) => {
        try {
            // Clear the refresh token cookie
            res.clearCookie('refreshtoken', { 
                httpOnly: true, 
                // secure: process.env.NODE_ENV === 'production', // Commented out for non-secure environments
                sameSite: 'Strict' // Adjust as necessary (Lax, Strict, None)
            });
            return res.json({ msg: "Logged Out" });
        } catch (err) {
            return res.status(500).json({ msg: "Server error" });
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await admin.findById(req.user.id).select('-password')
                || await employee.findById(req.user.id).select('-password');

            if (!user) return res.status(400).json({ msg: "User Not Found" });
            res.json(user);

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

}

const createAccessToken = (payload) => {
    return jwt.sign(payload, configure.jwtsecret, { expiresIn: '2m' });
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, configure.refreshsecret, { expiresIn: '7d' });
}

export default userAuthcontrol;
