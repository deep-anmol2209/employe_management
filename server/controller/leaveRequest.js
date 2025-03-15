import leave from "../model/leaveModel.js"
import employee from "../model/employeeModel.js";
import admin from "../model/adminModel.js";
import  mongoose  from "mongoose";
import leavemanagement from "../model/leavemanageModel.js";

const leaveControl={
    createLeaveRequest: async (req, res) => {
        try {
            const { type, reason, startDate, endDate } = req.body;
    
            // Validate the request body
            if (!type || !reason || !startDate || !endDate) {
                return res.status(400).json({ msg: "All fields are required" });
            }
    
            // Validate type
            if (!['Sick', 'Vacation', 'Casual'].includes(type)) {
                return res.status(400).json({ msg: "Invalid leave type" });
            }
    
            // Validate dates
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start > end) {
                return res.status(400).json({ msg: "End date must be after start date" });
            }
    
            // Assume user ID is available in req.user (set by authentication middleware)
            const userId = req.user.id;
    
            // Create a new leave request
            const newLeaveRequest = new leave({
                type,
                reason,
                startDate: start,
                endDate: end,
                status: 'pending', // Default status
                userId: userId
            });
    
            await newLeaveRequest.save();
    
            // Update the employee's leaveRequests array
            await employee.findByIdAndUpdate(
                userId,
                { $push: { leaveRequests: newLeaveRequest._id } },
                { new: true }
            );
    
            
            await leavemanagement.updateOne(
              {},  // Assuming there is only one LeaveManagement document
              { $push: { manageleave: newLeaveRequest._id } },  // Push the new leave request ID
              { new: true }
            );
    
            res.status(201).json({
                success: true,
                message: 'Leave request created successfully',
                data: newLeaveRequest
            });
        } catch (error) {
            console.error('Error creating leave request:', error.message);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    },
    getAdminManageLeaveCount: async (req, res) => {
      try {
        const { adminId } = req.params;
  
        // Validate adminId
        if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
          return res.status(400).json({ success: false, msg: "Admin ID is required" });
        }
  
        // Fetch the leave management document where the admin manages leaves
        const leaveManagement = await leavemanagement.findOne({ managedby: adminId });
  
        // Check if admin has managed leaves
        if (!leaveManagement) {
          return res.status(404).json({ success: false, msg: "No leaves managed by this admin" });
        }
  
        // Count the number of managed leaves
        const result = leaveManagement.manageleave.length;
  
        res.status(200).json({
          success: true,
          msg: "Leaves managed by admin found",
          result,
        });
      } catch (error) {
        console.error("Error fetching manageLeave count:", error.message);
        res.status(500).json({ success: false, msg: "Server error", error: error.message });
      }
    },
  
    getAdminManageLeaves: async (req, res) => {
      try {
        const { adminId } = req.params;
  
        // Validate adminId
        if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
          return res.status(400).json({ success: false, msg: "Admin ID is required" });
        }
  
        // Fetch leaves managed by the admin and populate details of leave and employee
        const leaveManagement = await leavemanagement
          .findOne({ managedby: adminId })
          .populate({
            path: "manageleave",
            populate: {
              path: "userId",
              model: "employee",
              select: "name", // Fields to select from employee
            },
          });
  
        // Check if there are managed leaves
        if (!leaveManagement) {
          return res.status(404).json({ success: false, msg: "No leaves managed by this admin" });
        }
  
        // Extract manageLeave array and count
        const manageLeaves = leaveManagement.manageleave;
        const totalManageLeaves = manageLeaves.length;
  
        res.status(200).json({
          success: true,
          totalManageLeaves,
          manageLeaves,
        });
      } catch (error) {
        console.error("Error fetching admin managed leaves:", error.message);
        res.status(500).json({ success: false, msg: "Server error", error: error.message });
      }
    },
  
      approveOrRejectLeave: async (req, res) => {
        try {
            const { leaveId } = req.params;
            const { action } = req.body; // 'approve' or 'reject'
    
            // Validate leaveId
            if (!leaveId || !mongoose.Types.ObjectId.isValid(leaveId)) {
                return res.status(400).json({ success: false, msg: "Invalid leave ID" });
            }
    
            // Validate the action
            if (!['approve', 'reject'].includes(action)) {
                return res.status(400).json({ success: false, msg: "Invalid action. Must be 'approve' or 'reject'." });
            }
    
            // Fetch the leave request by ID
            const leaveRequest = await leave.findById(leaveId);
    
            // Check if the leave request exists
            if (!leaveRequest) {
                return res.status(404).json({ success: false, msg: "Leave request not found." });
            }
    
            // Check if the leave request is already approved or rejected
            if (leaveRequest.status !== "pending") {
                return res.status(400).json({ success: false, msg: "Leave request has already been processed." });
            }
    
            // Update the status based on the action
            leaveRequest.status = action === "approve" ? "approved" : "rejected";
            await leaveRequest.save();
    
            // Remove the leaveId from the manageleave array after approval/rejection
            await leavemanagement.updateOne(
                { manageleave: leaveId },
                { $pull: { manageleave: leaveId } }
            );
            
            res.status(200).json({
                success: true,
                message: `Leave request has been ${leaveRequest.status}.`,
                data: leaveRequest,
            });
            console.log("okay")
        } catch (error) {
            console.error("Error updating leave request status:", error.message);
            res.status(500).json({ success: false, msg: "Server error", error: error.message });
        }
    },
    
    getallleaveRequests: async(req,res)=>{
        try{
          
          const requests = await leave
          .find({ status: { $ne: 'pending' } })
          .populate({
              path: 'userId', // Populate userId first
              select: 'name email profilePicture departmentId', // Select relevant fields from user
              populate: { path: 'departmentId', select: 'name' } // Populate departmentId inside userId
          });
            

            if(!requests){
                return res.status(403).json({msg: "not found"})
            }
            res.status(200).json({msg: "founded", requests})
        }catch(err){
          console.log(err)
          return res.status(500).json({msg: "internal server error"})
        }
    },
   getEmployeeLeaveRequestCount : async (req, res) => {
      try {
        const {Id} = req.params; // Get the employee id from request params
    
        // Find the employee by id and only return the count of leave requests
        const Employee = await employee.findById(Id).populate('leaveRequests');
    
        if (!Employee) {
          return res.status(404).json({ msg: 'Employee not found' });
        }
    
        
    // Ensure leaveRequests is an array
    const leaveRequestCount = Array.isArray(Employee.leaveRequests) ? Employee.leaveRequests.length : 0;
    
        // Return the count of leave requests
        return res.status(200).json({ msg: 'Leave request count found', leaveRequestCount });
      } catch (error) {
        console.error('Error fetching employee leave request count:', error);
        return res.status(500).json({ msg: 'Server error' });
      }
    },
    //employee can get their own leave history
    getEmployeeleave:async(req,res)=>{

      try{
       const {id}= req.params

       if(!id || !mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({msg: "not valid id "})
       }

       const employeeLeave = await employee.findById(id)
       .populate({
         path: 'leaveRequests', // Path to populate leaveRequests
         model: 'leave', // Referencing the leave model
       });
 
     // If employee not found
     if (!employeeLeave) {
       return res.status(404).json({ msg: 'Employee not found' });
     }
 
     // Return the leave requests of the employee
     return res.status(200).json({
       msg: 'Employee leave history fetched successfully',
       leaveRequests: employeeLeave.leaveRequests, // Only return leaveRequests array
     });
   } catch (err) {
     console.error('Error fetching employee leave history:', err);
     return res.status(500).json({ msg: 'Internal Server Error' });
   }
 }
}
    export default leaveControl;
    

  


