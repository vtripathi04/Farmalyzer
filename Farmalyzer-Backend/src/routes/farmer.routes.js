import { Router } from "express";
import { getAllSubmissions, getSubmission, loginFarmer, makeSubmission, registerFarmer } from "../controllers/farmer.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

// public routes

router.route('/register').post(registerFarmer)
router.route('/login').post(loginFarmer)

// protected routes

router.route('/submissions').post(verifyJWT, makeSubmission)
router.route('/submissions/all').get(verifyJWT, getAllSubmissions)
router.route('/submissions/:submissionId').get(verifyJWT, getSubmission)


export default router