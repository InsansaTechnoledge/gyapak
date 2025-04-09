class APIResponse {
    constructor(status, data, message = 'success') {
      this.status = status;
      this.data = data;
      this.message = message;
      this.success = status >= 200 && status < 300;
    }
  
    toJSON() {
      return {
        status: this.status,
        data: this.data,
        message: this.message,
        success: this.success,
      };
    }
  
    send(res) {
      return res.status(this.status).json(this.toJSON());
    }
  }
  
  export { APIResponse };
  