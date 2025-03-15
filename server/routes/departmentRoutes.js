import departmentControle from "../controller/departmentControler.js"
import express from "express"
 import auth from "../middleware/checkAuth.js"
import checkAdmin from "../middleware/checkAdmin.js"
 const router= express.Router()

 router.post("/postdepartment", [auth, checkAdmin], departmentControle.addDepartment);
router.get("/getdepartment", [auth,checkAdmin],departmentControle.fetchDepartments);
router.get('/getdepartmentsonly',[auth, checkAdmin], departmentControle.getdepartmentonly);
router.delete("/deleteDepartment/:id", [auth, checkAdmin], departmentControle.deleteDepeartmentById);

 export default router