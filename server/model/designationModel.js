import mongoose from "mongoose";


const designationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        min: 1, // Example: level 1 could be entry-level, level 2 could be senior, etc.
        max: 10
    },
    
    employeeIds:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'employee',
        
                }]
}, {
    versionKey: false, // Removes the __v field
    timestamps: true
});

const Designation = mongoose.model('Designation', designationSchema);

export default Designation;
