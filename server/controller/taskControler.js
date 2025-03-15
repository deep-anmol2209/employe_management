import task from '../model/taskModel.js'; // Ensure the path is correct
import admin from '../model/adminModel.js';
import employee from '../model/employeeModel.js';
import taskmanagement from '../model/taskmanageModel.js';
import  mongoose  from 'mongoose';
import { populate } from 'dotenv';

// Create a new task

const taskControl={
  createTasks: async (req, res) => {
    try {
        const { tasks } = req.body;

        if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
            return res.status(400).json({ msg: "Please provide a valid tasks array." });
        }

        // Array to hold created tasks
        const createdTasks = [];

        // Process each task
        for (const taskData of tasks) {
            const { title, description,  assignedTo, dueDate } = taskData;

            if (!title || !assignedTo || !dueDate) {
                return res.status(400).json({ msg: "Please enter valid information for all tasks." });
            }

            // Create a new task
            const newTask = new task({ title, description, assignedTo, dueDate });
            await newTask.save();

            // Find the user to whom the task is assigned
            const user = await employee.findById(assignedTo);
            if (!user) {
                // Optionally, you can delete the task if the user is not found
                await newTask.remove();
                return res.status(404).json({ success: false, message: `User with ID ${assignedTo} not found.` });
            }

            // Add the task to the user's tasks array
            user.tasks.push(newTask._id);
            await user.save();

            // Add the task to the created tasks array
            createdTasks.push(newTask);
        }

        res.status(201).json({
            success: true,
            message: 'Tasks created and assigned successfully',
            data: createdTasks
        });
    } catch (error) {
        console.error('Error creating tasks:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
},

// Fetch all tasks
 getAllTasks: async (req, res) => {
  try {
    const tasks = await task.find()
      .populate('assignedTo') // Populate the assignedTo field with user details
      .exec();

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
},

// Fetch a task by ID
 getTaskById : async (req, res) => {
  try {
    const { id } = req.params;

    const taskresult = await task.findById(id)
      .populate('assignedTo') // Populate the assignedTo field with user details
      .exec();

    if (!taskresult) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, data: taskresult });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
},

// Update a task
 updateTask: async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(id, { title, description, status, assignedTo }, { new: true, runValidators: true });

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task updated successfully', data: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
},

// Mark a task as completed
// Submit a task (by an employee)
submitTask: async (req, res) => {
  try {
      const { id } = req.params; // Task ID
      const { description } = req.body; // Submitted task description

      // Ensure required fields are provided
      if (!id || !description ) {
          return res.status(400).json({ success: false, message: 'Task ID, description are required' });
      }

      // Find the task by ID
      const taskResult = await task.findById(id);
      if (!taskResult) {
          return res.status(404).json({ success: false, message: 'Task not found' });
      }

      // Find all admins
      const admins = await admin.find();
      if (!admins.length) {
          return res.status(404).json({ success: false, message: 'No admins found' });
      }

      // Ensure req.user is defined and has an id
      if (!req.user || !req.user.id) {
          return res.status(400).json({ success: false, message: 'User ID is missing' });
      }
      const updatedTask = await task.findByIdAndUpdate(
        id, 
        { $set: { submittedOn: Date.now() } }, 
        { new: true }
      );
      // Push the task information into the taskmanage array in TaskManagement
    await taskmanagement.findOneAndUpdate(
      {}, // Assuming there's only one TaskManagement document
      { $push: { managetask: { task: taskResult._id, description: description, submittedBy: req.user.id , submittedOn: Date.now()} } },
      { new: true }
    );
      res.status(200).json({ success: true, message: 'Task submitted successfully', data: taskResult });
  } catch (error) {
      console.error('Error submitting task:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
},
completeTask: async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; 

    // Validate the action
    if (!['complete', 'fail'].includes(action)) {
      return res.status(400).json({ success: false, msg: "Invalid action. Must be 'complete' or 'fail'." });
    }

    // Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ObjectId" });
    }

    // Find the task by ID
    const taskResult = await task.findById(id);
    if (!taskResult) {
      return res.status(400).json({ success: false, message: 'Task not found' });
    }

    if (taskResult.status !== "pending") {
      return res.status(400).json({ msg: "Task status is already set." });
    }

    // Update the task status based on the action
    taskResult.status = action === 'complete' ? 'completed' : 'failed';
    await taskResult.save();

    // Remove the task from taskmanage in TaskManagement
    await taskmanagement.updateOne(
      { "managetask.task": id },
      { $pull: { managetask: { task: id } } }
    );

    res.status(200).json({
      success: true,
      message: `Task marked as ${taskResult.status} successfully`,
      data: taskResult,
    });
  } catch (error) {
    console.error('Error updating task status:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
},

getEmployeeTaskCount: async(req, res)=>{
  try{
     const {id}= req.params
     if(!id || !mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({msg: "invalid id"})
     }

      // Find the employee by id and only return the count of leave requests
      const Employee = await employee.findById(id).populate('tasks');
    
      if (!Employee) {
        return res.status(404).json({ msg: 'Employee not found' });
      }
  
      
  // Ensure leaveRequests is an array
  const tasksCount = Array.isArray(Employee.tasks) ? Employee.tasks.length : 0;
  
      // Return the count of leave requests
      return res.status(200).json({ msg: 'task count found', tasksCount });
    } catch (error) {
      console.error('Error fetching employee task count:', error);
      return res.status(500).json({ msg: 'Server error' });
    }
  },
  getEmployeePendingtask: async(req,res)=>{
    try{
      const {empid}= req.params
      if(!empid || !mongoose.Types.ObjectId.isValid(empid)){
        return res.status(400).json({msg: "employee id is not valid"})
      }
    // Find employee and populate the tasks field with pending tasks only
    const employeeData = await employee.findById(empid)
      .populate({
        path: 'tasks',
        match: { status: 'pending' }, // Fetch tasks with 'pending' status only
        select: 'title description dueDate'
      });

    if (!employeeData) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Return the pending tasks
    res.status(200).json({ pendingTasks: employeeData.tasks });
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
  },

  getmanageTask: async (req, res) => {
    try {
      const allTasks = await taskmanagement.find().select('managetask')
        .populate({
          path: 'managetask.task',
          select: 'title description submittedOn' // Select title and description from task
        })
        .populate({
          path: 'managetask.submittedBy',
          select: 'name email departmentId profilePicture ',
          populate: {
            path: 'departmentId', // Populate the departmentId field
            select: 'name'
    }})
        
  
      return res.status(200).json({ msg: "Tasks found", allTasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: "Error fetching tasks" });
    }
  },
  getEmployeeCompletedTask:async(req, res)=>{
       try{
        const {empid}= req.params
        if(!empid || !mongoose.Types.ObjectId.isValid(empid)){
          return res.status(400).json({msg: "nat a valid id "})
        }
        const employeetask = await employee.findById(empid).populate({
          path: 'tasks',
          match: { status: 'completed' },  // Filter only tasks with status 'completed'
      });

      // If employee is not found, return a 404 error
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      // Return the completed tasks
      res.status(200).json({
          success: true,
          completedTasks: employeetask.tasks,  // The populated tasks with status 'completed'
      })
    }
       catch(err){
        console.log(err)
      return res.status(500).json({msg: "internal server error"})
      }
    
  }

}

export default taskControl
