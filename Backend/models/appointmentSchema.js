import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required."],
      minLength: [3, "First Name must contain at least 3 characters."],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required."],
      minLength: [3, "Last Name must contain at least 3 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      validate: [validator.isEmail, "Provide a valid email."],
    },
    phone: {
      type: String,
      required: [true, "Phone is required."],
      minLength: [10, "Phone number must contain exact 10 digits."],
      maxLength: [10, "Phone number must contain exact 10 digits."],
    },
    dob: {
      type: Date,
      required: [true, "DOB is required."],
    },
    gender: {
      type: String,
      required: [true, "Gender is required."],
      enum: ["Male", "Female"],
    },
    appointment_date: {
      type: Date,
      required: [true, "Appointment date is required."],
    },
    department: {
      type: String,
      required: [true, "Department is required."],
    },
    doctor_firstName: {
      type: String,
      required: [true, "Doctor first name is required."],
    },
    doctor_lastName: {
      type: String,
      required: [true, "Doctor last name is required."],
    },
    hasVisited: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, "Address is required."],
      minLength: [10, "Address must contain at least 10 characters."],
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
