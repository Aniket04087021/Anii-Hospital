import express from "express";
import {
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", postAppointment);
router.get("/all", isAdminAuthenticated, getAllAppointments);
router.put("/:id/status", isAdminAuthenticated, updateAppointmentStatus);

export default router;
