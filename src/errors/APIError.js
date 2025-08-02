class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }

  toResponse() {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export default APIError;
