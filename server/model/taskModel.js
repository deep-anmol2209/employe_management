import mongoose, { Schema } from "mongoose"

const taskSchema= new Schema({

 title:{
    type: String,
    required: true
 },
 description: {
    type: String
 },
 assignedTo:{
    type: mongoose.Schema.Types.ObjectId, ref: "employee",
    required: true
    
 },
 submittedOn:{
type: Date,
default: null
 },
 dueDate:{
    type: Date,
    required: true
 },
 status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
 }
 
},{
    timestamps: true,
    versionKey: false
})

const task= mongoose.model("task", taskSchema)
export default task;