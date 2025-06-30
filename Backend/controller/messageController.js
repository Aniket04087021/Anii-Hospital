import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Message } from "../models/messageSchema.js";
export const sendMessage = catchAsyncErrors(async (req,res,next) => {
    const {firstName,lastName,email,phone,message} = req.body;
    if(!firstName || !lastName || !email || !phone || !message) {
        return res.status(400).json({
            success:false,
            message: 'Please fill all the fields of form.'});
            }
            await Message.create({firstName,lastName,email,message,phone});
            res.json({
                success:true,
                message: 'Message sent successfully.'});

    
})