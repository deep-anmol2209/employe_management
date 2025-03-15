import mongoose from "mongoose";

const manageTaskSchema = new mongoose.Schema({
  managetask: [
    {
      task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "task",
        required: true
      },
      description: {
        type: String,
        required: true
      },
      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee", // Assuming tasks are submitted by employees
        required: true
      },
      
    }
  ],
  managedby: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true
    }
  ]
}, {
  timestamps: true,
  versionKey: false
});

const taskmanagement = mongoose.model('taskmanagement', manageTaskSchema);

export default taskmanagement;
