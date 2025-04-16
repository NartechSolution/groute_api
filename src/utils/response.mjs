function response(res, statusCode, success, message, data) {
  return res.status(statusCode).json({
    statusCode,
    success,
    message,
    data,
  });
}

export default response;
