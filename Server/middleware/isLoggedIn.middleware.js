import { APIError } from '../Utility/ApiError.js';

export const isLoggedInMiddleware = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return new APIError(400, ['session expired , please login again']).send(
      res
    );
  }
};
