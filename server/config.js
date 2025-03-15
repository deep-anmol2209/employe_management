import dotenv from "dotenv";
dotenv.config();

export const configure = {
    mongodburi: process.env.DB_URI,  // Fixed variable name
    PORT: process.env.PORT,
    jwtsecret: process.env.JWT_SECRET, // Fixed uppercase naming
    admin_password: process.env.ADMIN_PASSWORD, // Fixed variable name
    refreshsecret: process.env.REFRESH_SECRET,
    cloudinary: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET
    }
};