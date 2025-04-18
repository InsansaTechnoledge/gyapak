class APIError extends Error {
    constructor(status, errors = [], message = '', stack = '') {
      const defaultMessage = APIError.getDefaultMessageForStatus(status);
      super(message || defaultMessage);
  
      this.status = status;
      this.data = null;
      this.message = message || defaultMessage;
      this.success = false;
      this.errors = errors;
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  
    static getDefaultMessageForStatus(status) {
      const statusMessages = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        409: 'Conflict',
        422: 'Unprocessable Entity',
        500: 'Internal Server Error',
      };
  
      return statusMessages[status] || 'Unknown Error';
    }
  
    toJSON() {
      return {
        status: this.status,
        message: this.message,
        success: this.success,
        errors: this.errors,
        data: this.data,
      };
    }
  
    send(res) {
      return res.status(this.status).json(this.toJSON());
    }
  }
  
  export { APIError };
  