const responseWithData = (res, statusCode, data) => res.status(statusCode).json(data);

const error = (res) => responseWithData(res, 500, {
  status: 500,
  message: "Oops! Something wrong!"
});

const badRequest = (res, message) => responseWithData(res, 400, {
  status: 400,
  message
});

const ok = (res, data) => responseWithData(res, 200, data);

const created = (res, data) => responseWithData(res, 201, data);

const unauthorized = (res) => responseWithData(res, 401, {
  status: 401,
  message: "Unauthorized"
});

const notFound = (res) => responseWithData(res, 404, {
  status: 404,
  message: "Resource not found"
});

export default {
  error,
  badRequest,
  ok,
  created,
  unauthorized,
  notFound
};