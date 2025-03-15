import express from "express"
import leaveControl from "../controller/leaveRequest.js"
import auth from "../middleware/checkAuth.js";
import checkAdmin from "../middleware/checkAdmin.js";
const router= express.Router();

router.post("/createleave", auth,leaveControl.createLeaveRequest)
router.get("/getallleaves", [auth, checkAdmin], leaveControl.getallleaveRequests)
router.get('/getallmanageleaves/:adminId', [auth,checkAdmin], leaveControl.getAdminManageLeaves)
router.get('/getCountofManageleaves/:adminId',[auth,checkAdmin], leaveControl.getAdminManageLeaveCount)
router.get('/getEmployeeLeaveCount/:Id', auth, leaveControl.getEmployeeLeaveRequestCount)
router.patch('/validate/leaverequest/:leaveId', [auth, checkAdmin], leaveControl.approveOrRejectLeave)
router.get('/employeeleavehistory/:id',auth, leaveControl.getEmployeeleave)

export default router