import express from "express"

import auth from "../middleware/checkAuth.js"
import checkAdmin from "../middleware/checkAdmin.js"
import designationControl from "../controller/designationController.js"

const router= express.Router()

router.post('/addDesignation',[auth, checkAdmin], designationControl.addDesignation)
router.get('/getDesignationName',[auth, checkAdmin], designationControl.fetchDesignation)



export default router