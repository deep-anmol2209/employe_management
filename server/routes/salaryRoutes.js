import express from "express"
import salaryControl from "../controller/salaryControler.js"
import checkAdmin from "../middleware/checkAdmin.js"
import auth from "../middleware/checkAuth.js"
const router = express.Router()

router.post("/addsalary",[auth,checkAdmin], salaryControl.addSalary)
router.get('/:id/getemployeesalary', auth, salaryControl.getownSalary)


export default router