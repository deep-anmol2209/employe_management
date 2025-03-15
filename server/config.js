import dotenv from "dotenv"

dotenv.config();

export const configure={

mongodburi: process.env.mongodburi,
PORT: process.env.PORT,
jwtsecret: process.env.jwtsecret,
admin_password: process.env.admin_password,
refreshsecret: process.env.refreshsecret,
cloudinary:{
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET
}


};