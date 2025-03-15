import mongoose, { Schema } from "mongoose"


const departmentSchema= new Schema({
name: {
    type: String,
    required:  true,
   
    
},
description: {
    type: String
},
permissions:{
    canAddRemoveEmployee:{
        type: Boolean,
        default: false
    },
    canManageSalary:{
        type: Boolean,
        default: false,
    },
    canHandleTechIssues: {
        type: Boolean,
        default: false
    }
},
employees: [{type: mongoose.Schema.Types.ObjectId, ref: "employee"}]

},{
    timestamps: true,
    versionKey: false
})

const department= mongoose.model("department", departmentSchema);
export default department;