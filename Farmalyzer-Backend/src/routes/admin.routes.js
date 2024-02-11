import { Router } from "express";
import { createFolder, 
deleteFolder, 
getAllFarmers, 
getAllFolders, 
getAllSubmissions, 
getFarmer,
getSubmissionByCropName, 
getSubmissionsByFarmerId, 
getSubmissionsByFolderId, 
getUsersByFolderId, 
loginAdmin, 
registerAdmin } from "../controllers/admin.controllers.js";

const router = Router()


// public routes

router.route('/register').post(registerAdmin)
router.route('/login').post(loginAdmin)


// protected routes

router.route('/folders').post(createFolder).get(getAllFolders)
router.route('/folders/:folderId').delete(deleteFolder)

router.route('/users').get(getAllFarmers) // get all farmers
router.route('/users/:farmerId').get(getFarmer) // get a specific user
router.route('/users/:folderId').get(getUsersByFolderId) // get a users by folder Id
router.route('/users/:farmerId').put() // update a specific user


router.route('/submissions').get(getAllSubmissions) // get all submissions
router.route('/submissions/crop/:cropName').get(getSubmissionByCropName)  // get all submissions by crop name
router.route('/submissions/farmer/:farmerId').get(getSubmissionsByFarmerId) // get all submissions by farmer Id
router.route('/submissions/folder/:folderId').get(getSubmissionsByFolderId) // get all submissions by folder Id









export default router