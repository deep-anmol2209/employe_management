import department from "../model/departmentModel.js";
import employee from "../model/employeeModel.js";
const checkpermissions={
checkHR: async(req,res,next)=>{
    try {
        if(req.user.role==='admin'){
            return next()
        }
        // Assuming req.user contains the employee's ObjectId
        const employeeId = req.user.id;
        

        // Find the employee and populate the department field
        const emp = await employee.findById(employeeId).populate('departmentId');
        if (!emp) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        // Access the department from the populated field
        console.log(emp)
        const dept = emp.departmentId;
        if (!dept || !dept.permissions.canAddRemoveEmployee) {
            return res.status(403).json({ msg: "Access denied: HR permissions required" });
        }

        next();
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
},
}

export default checkpermissions