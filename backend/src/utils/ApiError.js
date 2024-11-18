class ApiError extends Error{
    constructor(statusCode,message="Something went wrong",error=[],stack) {
        super(message)
        this.statusCode=statusCode
        this.success=false
        this.error=error;
        this.data=null;
        this.message=message;
        if(stack)
        {
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {ApiError}