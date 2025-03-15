import mongoose from "mongoose";
import Salary from "../model/salaryModel.js";
import employee from "../model/employeeModel.js";

const salaryControl = {
  addSalary: async (req, res) => {
    try {
      const { salaries } = req.body;

      // Check if salaries array exists and is valid
      if (!salaries || !Array.isArray(salaries) || salaries.length === 0) {
        return res.status(400).json({ msg: "Invalid or empty salaries data provided" });
      }

      // Insert multiple salary documents into the database
      const salaryDocs = await Salary.insertMany(salaries);

      // Update each employee with the respective salary
      for (const salary of salaryDocs) {
        await employee.findByIdAndUpdate(salary.userId, {
          $push: { salary: salary._id }
        });
      }

      // Respond with success message and added salary documents
      res.status(201).json({ msg: "Salaries added successfully", salaryDocs });

    } catch (err) {
      // Log the error to the server console for debugging
      console.error(err);
      
      // Respond with server error status and message
      res.status(500).json({ msg: "Server error, could not add salaries" });
    }
  },
  getownSalary: async(req,res)=>{
   try{
   const {id} = req.params
   if(!id || !mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({msg: "id not valid"})
   }
   // Find employee by ID and populate the salary field
   const employeeSalary = await employee.findById(id)
   .populate({
       path: 'salary',
       select: 'totalSalary paidDate status' // Populate salary with relevant fields
   });

// Check if the employee exists
if (!employeeSalary) {
   return res.status(404).json({ msg: "Employee not found" });
}

// Return the employee's salary information
return res.status(200).json({
   msg: "Salary details fetched successfully",
   salary: employeeSalary.salary
});
} catch (err) {
console.error(err);
return res.status(500).json({ msg: "Server error" });
}
}
}

export default salaryControl;
