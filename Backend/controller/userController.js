import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";


export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, dob, gender, password } =
    req.body;
  const requiredFields = {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
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

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("Already registered", 400));
  }
  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Patient",
  });

  res.status(201).json({
    success:true,
    message:'user registered'
  })
});

export const patientLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }

  const patient = await User.findOne({ email, role: "Patient" }).select("+password");
  if (!patient) {
    return next(new ErrorHandler("Invalid patient credentials.", 401));
  }

  const isPasswordMatched = await patient.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid patient credentials.", 401));
  }

  const token = patient.generateJsonWebToken();

  res
    .status(200)
    .cookie("patientToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      expires: new Date(
        Date.now() + Number(process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      success: true,
      message: "Patient login successful.",
    });
});

export const patientLogout = catchAsyncErrors(async (req, res) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient logged out.",
    });
});

export const getAllDoctors = catchAsyncErrors(async (req, res) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;

  const requiredFields = {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    doctorDepartment,
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

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Doctor already exists with this email.", 400));
  }

  await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    doctorDepartment,
    role: "Doctor",
  });

  res.status(201).json({
    success: true,
    message: "Doctor added successfully.",
  });
});

export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const doctor = await User.findById(id);
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found.", 404));
  }

  if (doctor.role !== "Doctor") {
    return next(new ErrorHandler("Selected user is not a doctor.", 400));
  }

  await doctor.deleteOne();

  res.status(200).json({
    success: true,
    message: "Doctor removed successfully.",
  });
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const setupKey = req.headers["x-admin-setup-key"];
  if (!process.env.ADMIN_SETUP_KEY) {
    return next(new ErrorHandler("Admin setup key is not configured on server.", 500));
  }

  if (setupKey !== process.env.ADMIN_SETUP_KEY) {
    return next(new ErrorHandler("Invalid admin setup key.", 401));
  }

  const { firstName, lastName, email, phone, dob, gender, password } = req.body;

  const requiredFields = {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
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

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists with this email.", 400));
  }

  await User.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    password,
    role: "Admin",
  });

  res.status(201).json({
    success: true,
    message: "Admin created successfully.",
  });
});

export const adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }

  const admin = await User.findOne({ email, role: "Admin" }).select("+password");
  if (!admin) {
    return next(new ErrorHandler("Invalid admin credentials.", 401));
  }

  const isPasswordMatched = await admin.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid admin credentials.", 401));
  }

  const token = admin.generateJsonWebToken();

  res
    .status(200)
    .cookie("adminToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      expires: new Date(
        Date.now() + Number(process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      success: true,
      message: "Admin login successful.",
    });
});

export const adminLogout = catchAsyncErrors(async (req, res) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin logged out.",
    });
});

export const getAdminProfile = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

  
