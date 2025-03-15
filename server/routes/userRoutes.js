import usercontrol from "../controller/usercontroler.js"
import auth from "../middleware/checkAuth.js"
import checkAdmin from "../middleware/checkAdmin.js"
import checkpermissions from "../middleware/checkPermissions.js"
import express from "express"
//const router = require('express').Router()
const router= express.Router()
router.post('/addNewadmin',[auth, checkAdmin], usercontrol.addAdmin)
router.post("/addemploye", [auth, checkpermissions.checkHR], usercontrol.addEmployee  )
router.delete("/employee/delete/:id",[auth, checkAdmin], usercontrol.deleteEmployee)
router.put("/employee/update/:userId",[auth,checkAdmin] , usercontrol.updateEmployeeDetails)
router.get('/fetchemployee', [auth,checkAdmin], usercontrol.getallemployees)
router.get("/getemployeebyid", auth, usercontrol.getEmployeeById)
router.get("/getemployeeonly", [auth, checkAdmin], usercontrol.getemployeesonly)
router.get('/getemployee/:id', [auth, checkAdmin], usercontrol.getEmployeeByIdinParam)
router.get("/getemployeeindepartment/:depname", [auth, checkAdmin], usercontrol.getDepartmentEmployees)
export default router