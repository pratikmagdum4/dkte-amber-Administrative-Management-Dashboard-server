import express from "express";
import {
  adminSignup,

} from "../../controllers/SignUp/AdminSignUpController.js"; 

const router = express.Router();

// POST /signup/clerk - Clerk signup route
router.post("/admin", adminSignup);


export default router;

