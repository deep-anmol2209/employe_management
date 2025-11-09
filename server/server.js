import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'; 
import  {configure}  from './config.js';
import dotenv from "dotenv"
import path from "path"
import cors from "cors"
import { fileURLToPath } from 'url';
import checkpermissions from './middleware/checkPermissions.js';
import userRoutes from './routes/userRoutes.js';
import departmentRoutes from "./routes/departmentRoutes.js"
import admin from './model/adminModel.js';
import authRoutes from "./routes/authRoutes.js"
import bcrypt from "bcrypt"
import taskRoutes from "./routes/taskRoutes.js"
import taskmanagement from './model/taskmanageModel.js';
import leavemanagement from './model/leavemanageModel.js';
import leaveRoutes from "./routes/leaveRoutes.js"
import salaryRoutes from "./routes/salaryRoutes.js"
import designationRoutes from "./routes/designationRoutes.js"



dotenv.config()
const app = express();
const PORT = process.env.PORT;


// Middleware
app.use(express.json({limit: "50mb"}))
app.use(bodyParser.json());
const allowedOrigins = [
    "https://employe.manage.mepl-erp.co.in",
    "http://localhost:5001" // Add other allowed origins here
  ];
  
  app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // Allow credentials (cookies, headers, etc.)
  }));
  
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use(auth(configure))

//routes
app.use("/api/user", authRoutes)
app.use("/api/Admin", userRoutes)
app.use("/api/departments", departmentRoutes )
app.use("/api/usertask", taskRoutes)
app.use("/api/leave", leaveRoutes )
app.use('/api/salary', salaryRoutes)
app.use('/api/designation', designationRoutes)

// Database Connection
console.log(process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {console.log('MongoDB Connected');
    init();
   
})
  .catch(err => console.log(err.message));

  async function init() {
    try {

        let user = await admin.findOne({ role: "admin" });
        if (user) {
            console.log("Admin is already present:", user); 

            // Ensure the admin ID is pushed to managedby arrays if they are empty
            let leaveManagement = await leavemanagement.findOne({});
            let taskManagement = await taskmanagement.findOne({});

            // If no leaveManagement document exists, create one
            if (!leaveManagement) {
                leaveManagement = new leavemanagement({
                    managedby: [user._id]
                });
                await leaveManagement.save();
                console.log("Leave management document created and admin ID added.");
            } else if (leaveManagement.managedby.length === 0) {
                await leavemanagement.updateOne(
                    {},
                    { $push: { managedby: user._id } }
                );
                console.log("Admin ID pushed to manageLeave managedby array.");
            } else {
                console.log("Leave management already has admin ID.");
            }

            // If no taskManagement document exists, create one
            if (!taskManagement) {
                taskManagement = new taskmanagement({
                    managedby: [user._id]
                });
                await taskManagement.save();
                console.log("Task management document created and admin ID added.");
            } else if (taskManagement.managedby.length === 0) {
                await taskmanagement.updateOne(
                    {},
                    { $push: { managedby: user._id } }
                );
                console.log("Admin ID pushed to taskManage managedby array.");
            } else {
                console.log("Task management already has admin ID.");
            }

            return;
        }
    } catch (err) {
        console.log("Error while reading the data:", err);
    }

    try {
        const hashpassword = await bcrypt.hash(configure.admin_password, 10);
        const Adminuser = new admin({
            name: "Prakhar",
            email: "prakhar@gmail.com",
            password: hashpassword,
            role: "admin"
        });
        await Adminuser.save();
        console.log("Admin created:\n", Adminuser);

        // Now, add the new admin's ID to managedby arrays in both schemas
        await leavemanagement.updateOne(
            {},
            { $push: { managedby: Adminuser._id } },
            { upsert: true } // Ensure the document exists or create it
        );
        console.log("Admin ID pushed to manageLeave managedby array.");

        await taskmanagement.updateOne(
            {},
            { $push: { managedby: Adminuser._id } },
            { upsert: true } // Ensure the document exists or create it
        );
        console.log("Admin ID pushed to taskManage managedby array.");
    } catch (err) {
        console.log("Error while creating admin:", err);
    }
}

 

  
  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

