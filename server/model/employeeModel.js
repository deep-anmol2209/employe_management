import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

// Separate schema for Address
const addressSchema = new mongoose.Schema({
    city: { type: String, required: true },
    state: { type: String, required: true },
    locality: { type: String }
});

// Main employee schema
const employeeSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "employee",
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String, // store filename (e.g. "123456789-photo.jpg")
        required: false
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"],
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    address: addressSchema,
    mobileNo: {
        type: String,
        unique: true,
        required: true,
        match: [/^\d{10}$/, 'Mobile number must be 10 digits']
    },
   
    lastSalaryPaidDate: {
        type: Date,
        default: null
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    basicSalary: {
        type: Number,
        default: null
    },
    education_details: {
        highestQualification: {
            type: String,
            enum: ['Matriculation', 'Intermediate', 'Graduate', 'Post Graduate'],
            required: true,
        },
        universitySchoolname: {
            type: String,
            required: true
        }
    },
    bankDetails: {
        accountNo: { type: String, unique: true, required: true },
        ifscCode: { type: String, required: true },
        accHolderName: { type: String, required: true }
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "department",
        required: true
    },
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "notification"
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "task"
    }],
    leaveRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "leave"
    }],
    salary: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Salary"
    }]
}, {
    timestamps: true,
    versionKey: false
});

// Auto-increment ID
employeeSchema.plugin(AutoIncrement, { inc_field: 'id' });

const employee = mongoose.model('employee', employeeSchema);
export default employee;
