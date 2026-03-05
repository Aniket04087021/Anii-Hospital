import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  adminLogin,
  adminLogout,
  deleteDoctor,
  getAllDoctors,
  getAdminProfile,
  patientLogin,
  patientLogout,
  patientRegister,
} from "../controller/userController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.post('/patient/register', patientRegister);
router.post('/login', patientLogin);
router.get('/patient/logout', isPatientAuthenticated, patientLogout);
router.post('/admin/add', addNewAdmin);
router.post('/admin/login', adminLogin);
router.get('/admin/logout', isAdminAuthenticated, adminLogout);
router.get('/admin/me', isAdminAuthenticated, getAdminProfile);
router.post('/doctor/add', isAdminAuthenticated, addNewDoctor);
router.delete('/doctor/:id', isAdminAuthenticated, deleteDoctor);
router.get('/doctors', getAllDoctors);


export default router;
