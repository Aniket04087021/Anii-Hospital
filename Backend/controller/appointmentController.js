import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  const requiredFields = {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    address,
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([, value]) => {
      if (value === undefined || value === null) return true;
      if (typeof value === "string" && value.trim() === "") return true;
      return false;
    })
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return next(
      new ErrorHandler(
        `Please fill all required fields: ${missingFields.join(", ")}`,
        400
      )
    );
  }

  await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited: Boolean(hasVisited),
    address,
  });

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully.",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res) => {
  const appointments = await Appointment.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    appointments,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return next(new ErrorHandler("Status is required.", 400));
  }

  const allowedStatuses = ["Pending", "Accepted", "Rejected"];
  if (!allowedStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid status value.", 400));
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found.", 404));
  }

  appointment.status = status;
  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Appointment status updated.",
    appointment,
  });
});
