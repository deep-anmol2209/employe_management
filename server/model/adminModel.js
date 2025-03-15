import mongoose from "mongoose"
import task from "./taskModel.js"
import employee from "./employeeModel.js"
import leave from "./leaveModel.js"
const adminSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required : true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        default: "admin"
    }
    

})

const admin= mongoose.model('admin', adminSchema)
export default admin