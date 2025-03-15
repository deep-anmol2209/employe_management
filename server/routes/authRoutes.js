import userAuthcontrol from "../controller/userAuth.js"
import auth from "../middleware/checkAuth.js"
import express from "express"
//const router = require('express').Router()
const router= express.Router()

router.post('/login',userAuthcontrol.login)

router.get('/logout',userAuthcontrol.logout)

router.get('/refresh_token',userAuthcontrol.refreshtoken)

router.get('/infor',auth,userAuthcontrol.getUser)
 

export default router