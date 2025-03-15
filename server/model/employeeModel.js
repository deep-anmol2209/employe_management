import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";


const AutoIncrement = AutoIncrementFactory(mongoose);

// Separate schema for Address
const addressSchema = new mongoose.Schema({
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true},
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
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']  // Email validation
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        public_id: String,
        secure_url: String
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
    address: addressSchema,  // Use the address schema
    mobileNo: {
        type: String,
        unique: true,
        required: true,
        match: [/^\d{10}$/, 'Mobile number must be 10 digits']  // Mobile number validation
    },
    designationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designation',
        required: true
    },
    lastSalaryPaidDate:{
        type: Date,
        default: null
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    basicSalary: {
        type: Number,  // Store salary as a number for consistency
        default: null
    },
    education_details: {
        highestQualification: {
            type: String,
            enum: ['Matriculation', 'Intermediate', 'Graduate', 'Post Graduate'],
            required: true,
        },
        marksheet_degree_image: {
            public_id: { type: String, required: true },
            secure_url: { type: String, required: true }
        },
        universitySchoolname: {
            type: String,
            required: true
        }
    },
    idproofs: {
        adharNo: {
            type: String,
            required: true,
            unique: true
        },
        adharPhoto: {
            public_id: { type: String, required:  false},
            secure_url: { type: String, required: false }
        },
        panNo: {
            type: String,
            required: true,
            unique: true
        },
        panPhoto: {
            public_id: { type: String, required: false },
            secure_url: { type: String, required: false }
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
    notifications: [{  // Correct typo
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
