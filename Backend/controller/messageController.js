import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/error.js";
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

export const getAllMessages = catchAsyncErrors(async (req, res) => {
    const messages = await Message.find().sort({ _id: -1 });
    res.status(200).json({
        success: true,
        messages,
    });
});

export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
        return next(new ErrorHandler("Message not found.", 404));
    }

    await message.deleteOne();
    res.status(200).json({
        success: true,
        message: "Message deleted successfully.",
    });
});
