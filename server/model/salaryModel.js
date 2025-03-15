import mongoose, { Schema } from "mongoose";

const salarySchema = new Schema({
   totalSalary:{
    type: Number,
    required: true
   },
    status: {
        type: String,
        
        default: 'Paid',
    },
    paidDate: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "employee",
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Salary = mongoose.model("Salary", salarySchema);
export default Salary;
