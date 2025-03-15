import express from 'express';
import taskControl from '../controller/taskControler.js';
import auth from '../middleware/checkAuth.js';
import checkAdmin from '../middleware/checkAdmin.js'
const router = express.Router();

router.post('/tasks',[auth, checkAdmin], taskControl.createTasks);
router.get('/getalltasks', taskControl.getAllTasks);
router.get('/tasks/:id', taskControl.getTaskById);
router.put('/tasks/:id', taskControl.updateTask);
router.patch('/tasks/:id/complete', auth,taskControl.submitTask); // Use PATCH to update status only
router.patch('/tasks/:id',[auth,checkAdmin], taskControl.completeTask)
router.get('/getemployeeTaskcount/:id', taskControl.getEmployeeTaskCount)
router.get("/getemployeependingtask/:empid", auth, taskControl.getEmployeePendingtask)
router.get('/getallmanagetasks', [auth, checkAdmin], taskControl.getmanageTask)
router.get('/employee/task/completed/:empid', auth, taskControl.getEmployeeCompletedTask)

export default router;