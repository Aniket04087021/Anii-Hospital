class ErrorHandler extends Error {
    constructor(message, code, status) {
        super(message);
        this.statusCode = statusCode;

}

}

export const errorMiddleware = (err, req, res, next) =>{
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenErr"){
        const message = "Your token is invalid. Please log in";
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError"){
        const message = "Your token is expired. ";
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "CastError"){
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }


}