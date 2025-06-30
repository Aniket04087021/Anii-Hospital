class ErrorHandler extends Error {
    constructor(message, code, status) {
        super(message);
        this.statusCode = statusCode;

}

}

export const errorMiddleware = (err, req, res, next) =>{
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;


}