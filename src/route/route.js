const express = require('express')
const router = express.Router()

//--------------------|| CONTROLLERS ||----------------------

const userController = require('../controller/userController.js')
const jobController = require('../controller/taskController.js')

//--------------------|| MIDDLEWARE ||----------------------

const {authorization} = require("../middlewar/auth.js") 
const {registerValidation, loginValidation, taskValidation} = require("../middlewar/validation.js") 


//--------------------|| USER API'S ||----------------------

router.post('/userRegistration',registerValidation, userController.userRegistration )
router.post("/loginUser", loginValidation, userController.loginUser)

router.get('/getUserList', authorization, userController.getUserList)



//--------------------|| TASK API'S ||----------------------

router.post('/createTask', authorization, taskValidation, jobController.createTask )
router.get("/getTaskList",authorization, jobController.getTaskList)
router.get("/getTaskListByUserId", authorization, jobController.getTaskListByUserId)
router.put('/updateTask', authorization, taskValidation, jobController.updateTask)
router.put("/updateTaskStatus", authorization, jobController.updateTaskStatus)
router.delete("/deleteTask", authorization, jobController.deleteTask)



//--------------------|| FOR VALIDATE ENDPOINT ||----------------------

router.all("/*", function (req, res) {
    res.status(400).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct !!!"
    })
})


module.exports = router