
import department from "../model/departmentModel.js";
import mongoose from "mongoose"

const departmentControl={

addDepartment: async(req,res)=>{

      try {
          // Extract name, description, and permissions from the request body
          const { name, description } = req.body;
  
          // Check if the 'name' field is provided
          if (!name) {
              return res.status(400).json({ message: "Department name is required" });
          }
  
          // Define default permissions
          let permissions = {
              canAddRemoveEmployee: false,
              canManageSalary: false,
              canHandleTechIssues: false
          };
  
          // If the department name is "HR", set specific permissions
          if (name.toLowerCase() === "hr") {
              permissions.canAddRemoveEmployee = true;
          }
  
          // Create a new department with the specified name, description, and permissions
          const newDepartment = new department({
              name,
              description,
              permissions,
              employees: []  // Initially, no employees are added
          });
  
          // Save the department to the database
          const savedDepartment = await newDepartment.save();
  
          // Send a success response with the created department
          return res.status(201).json({ message: "Department created successfully", result: savedDepartment });
  
      } catch (error) {
          // Handle any errors during department creation
          return res.status(500).json({ message: "Error creating department", error: error.message });
      }
  },
  
fetchDepartments: async(req, res)=>{
   try{
    const result= await department.find()
                 .populate({path:"employees",
                      select: "_id"    
                })
                 .exec()
                 console.log(result.length)
   if(!result || result.length===0){
    return res.status(400).json({msg: "no department added yet"})
   }
                 res.status(200).json({msg: "found", result})
   }catch(err){
    console.log(err)
        res.status(500).json({msg:"internal server error"})
   }
},
getdepartmentonly: async(req,res)=>{
  try{
   const result= await department.countDocuments()
   if(!result){
    return res.status(403).json({msg: "no department found"})
   }
   res.status(200).json({msg: "founded", result})
  }catch(err){
    return res.status(500).json({msg: "internal server error"})
  }
},
 deleteDepeartmentById: async(req,res)=>{
  try{
 const {id}= req.params
 if(!id || !mongoose.Types.ObjectId.isValid(id)){
  return res.status(400).json({msg: "invalid id "})
 }

 const result = await department.findByIdAndDelete(id)
 if(!result){
  return res.status(400).json({msg: "department not found"})
 }

res.status(200).json({msg: "department deleted successfuly"})

  }catch(err){
    return res.status(500).json({msg : "internal server error"})
  }
 }


}
export default departmentControl